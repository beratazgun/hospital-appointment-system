import { z } from 'zod';

export const envSchema = z.object({
  // PORTS
  BACKEND_SERVICE_PORT: z.string().transform((val) => parseInt(val, 10)),
  NOTIFICATION_SERVICE_PORT: z.string().transform((val) => parseInt(val, 10)),

  // DOMAINS
  APIGW_SERVICE_DOMAIN: z.string(),
  FRONTEND_SERVICE_DOMAIN: z.string(),
  BACKEND_SERVICE_DOMAIN: z.string(),
  NOTIFICATION_SERVICE_DOMAIN: z.string(),

  // Email
  DEVELOPER_MAIL_FOR_DEV_ENV: z.string().email(),

  // NODE_ENV
  NODE_ENV: z.enum(['development', 'production', 'test']),

  // SERVICES ENDPOINTS
  BACKEND_SERVICE_BASE_ENDPOINT: z.string(),
  NOTIFICATION_SERVICE_BASE_ENDPOINT: z.string(),

  // EMAIL PROVIDER
  RESEND_API_KEY: z.string(),

  // POSTGRES
  POSTGRES_URL: z.string(),

  // RABBITMQ
  RABBITMQ_USERNAME: z.string(),
  RABBITMQ_PASSWORD: z.string(),
  RABBITMQ_HOST: z.string(),
  RABBITMQ_URI: z.string(),

  // REDIS
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string().transform((val) => parseInt(val, 10)),
  REDIS_PASSWORD: z.string(),

  // MONGO
  MONGO_USERNAME: z.string(),
  MONGO_PASSWORD: z.string(),
  MONGO_HOST: z.string(),
  MONGO_PORT: z.string().transform((val) => parseInt(val, 10)),
  MONGO_URI: z.string(),

  // SESSION
  SESSION_SECRET: z.string(),
  SESSION_EXPIRATION: z.string().transform((val) => parseInt(val, 10)),

  // COOKIES
  COOKIE_SESSION_KEYWORD: z.string(),
});

export const validateEnv = (config: Record<string, unknown>) => {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    throw new Error(
      `Env validation error ---> ${JSON.stringify(parsed.error.format())}`,
    );
  }
  return parsed.data;
};

export type EnvType = z.infer<typeof envSchema>;
