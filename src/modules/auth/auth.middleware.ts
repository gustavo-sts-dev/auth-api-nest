import { Injectable, NestMiddleware } from '@nestjs/common';
import type { FastifyRequest, FastifyReply } from 'fastify';
import fastifyCookie, { FastifyCookie } from '@fastify/cookie';
import { $env } from 'src/config/env.config';
import { jwtVerify } from 'jose';
import { publicKey } from 'src/config/jwt-secrets.config';

type Request = FastifyRequest &
  FastifyCookie & {
    headers: {
      cookie: {
        accessToken: string;
        refreshToken: string;
      };
    };
  };

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: FastifyReply, next: () => void) {
    const rawRefreshToken = req.headers.cookie['refreshToken'];

    const { valid, value } = fastifyCookie.unsign(
      rawRefreshToken,
      $env.COOKIE_SECRET,
    );

    if (!valid || !value)
      return res.status(401).send({
        status: 401,
        error: 'Unauthorized.',
      });

    const { payload } = await jwtVerify(value, publicKey, {
      algorithms: ['EdDSA'],
      issuer: $env.API_URL,
      audience: $env.ORIGIN,
    });

    const { username, role } = payload as { username: string; role: string };

    if (!username || !role)
      return res.status(401).send({
        status: 401,
        error: 'Unauthorized.',
      });

    req.user.username = username;
    req.user.role = role;

    next();
  }
}
