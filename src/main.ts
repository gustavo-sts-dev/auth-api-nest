import { NestFactory } from '@nestjs/core';
import { fastifyCookie } from '@fastify/cookie';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { initKeyPair } from './config/jwt-secrets.config';
import { $env } from './config/env.config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.register(fastifyCookie, {
    secret: $env.COOKIE_SECRET,
  });

  initKeyPair().catch((e) => {
    const isError = e instanceof Error;
    if (isError) {
      const message = e.message;
      throw new Error(message);
    }
  });

  app.enableShutdownHooks();

  await app.listen($env.PORT ?? 3000);
}
bootstrap().catch((error) =>
  console.log(`Erro ao iniciar o servidor: ${error}`),
);
