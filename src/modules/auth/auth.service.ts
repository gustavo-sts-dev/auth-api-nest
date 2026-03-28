import { $env } from 'src/config/env.config';
import { CreateUsersDTO, LoginUsersDTO } from './auth.dto';
import { AuthRepository } from './auth.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { SignJWT } from 'jose';
import { privateKey } from 'src/config/jwt-secrets.config';

@Injectable()
export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async generateToken(id: string, role: string, token: 'access' | 'refresh') {
    const jwtToken = new SignJWT({ id, role })
      .setProtectedHeader({ alg: 'EdDSA' })
      .setIssuedAt()
      .setIssuer($env.API_URL)
      .setAudience($env.ORIGIN)
      .setJti(crypto.randomUUID())
      .setExpirationTime(
        token === 'access' ? $env.JWT_ACCESS_EXPIRES : $env.JWT_REFRESH_EXPIRES,
      )
      .sign(privateKey);

    return jwtToken;
  }

  async create(data: CreateUsersDTO) {
    const { password, ...userData } = data;

    const hahsedPassword = await hash(password, {
      parallelism: 1,
      memoryCost: 32768,
      timeCost: 3,
    });

    const result = await this.authRepository.create({
      ...userData,
      password: hahsedPassword,
      role: 'user',
    });

    const user = {
      id: result.id,
      name: result.name,
      username: result.username,
      email: result.email,
      role: result.role,
    };

    const accessToken = await this.generateToken(
      user.id,
      user.role || 'user',
      'access',
    );

    const refreshToken = await this.generateToken(
      user.id,
      user.role || 'user',
      'refresh',
    );

    return { user, accessToken, refreshToken };
  }

  async login({ email, password }: LoginUsersDTO) {
    const result = await this.authRepository.findByEmail(email);

    if (!result) throw new UnauthorizedException('Credenciais inválidas.');

    const correctPassword = await verify(result.password, password);

    if (!correctPassword)
      throw new UnauthorizedException('Credenciais inválidas.');

    const user = {
      id: result.id,
      name: result.name,
      username: result.username,
      email: result.email,
      role: result.role,
    };

    const accessToken = await this.generateToken(
      user.id,
      user.role || 'user',
      'access',
    );

    const refreshToken = await this.generateToken(
      user.id,
      user.role || 'user',
      'refresh',
    );

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
