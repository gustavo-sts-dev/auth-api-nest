import { $env } from 'src/config/env.config';
import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  createUserSchema,
  loginUsersSchema,
  type LoginUsersDTO,
  type CreateUsersDTO,
} from './auth.dto';
import { ZodValidationPipe } from 'src/zod-validation.pipe';
import { type FastifyReply } from 'fastify';
import type { CookieSerializeOptions } from '@fastify/cookie';

type Reply = FastifyReply & {
  setCookie(
    name: string,
    value: string,
    options?: CookieSerializeOptions,
  ): FastifyReply;
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async create(
    @Body() body: CreateUsersDTO,
    @Res({ passthrough: true }) res: Reply,
  ) {
    const result = await this.authService.create(body);

    res.setCookie('accessToken', result.accessToken, {
      secure: $env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 900,
    });

    res.setCookie('refreshToken', result.refreshToken, {
      secure: $env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 604800,
    });
    return result.user;
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(loginUsersSchema))
  async login(
    @Body() body: LoginUsersDTO,
    @Res({ passthrough: true }) res: Reply,
  ) {
    const result = await this.authService.login(body);

    res.setCookie('accessToken', result.accessToken, {
      secure: $env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 900,
    });

    res.setCookie('refreshToken', result.refreshToken, {
      secure: $env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 604800,
    });

    res.status(200).send(result.user);
  }
}
