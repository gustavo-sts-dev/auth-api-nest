import { z } from 'zod';
import { loadEnvFile, env } from 'node:process';

if (env.NODE_ENV !== 'production') loadEnvFile();

export const $env = z
  .object({
    NODE_ENV: z.enum(['development', 'production']),
    PORT: z.coerce.number().optional(),
    ORIGIN: z.url(),
    DATABASE_URL: z.url(),
    REDIS_URI: z.url().optional(),
    JWT_ACCESS_EXPIRES: z.string(),
    JWT_REFRESH_EXPIRES: z.string(),
    JWT_PRIVATE_KEY_BASE64: z.string(),
    JWT_PUBLIC_KEY_BASE64: z.string(),
    COOKIE_SECRET: z.string().min(32),
    API_URL: z.url(),
  })
  .parse(env);
