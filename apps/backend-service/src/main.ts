import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  Logger,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import helmet from 'helmet';
import { snakeCase } from 'lodash';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import sessions from 'express-session';
import RedisStore from 'connect-redis';
import { RedisService } from '@common/modules/redis/redis.service';
import cookieParser from 'cookie-parser';
import { exceptionFactory } from './core/exceptions/exception.factory';
import { bold } from 'cli-color';
import { ConfigService } from '@nestjs/config';
import { REDIS_CONNECTION } from '@common';

/**
 * Set Swagger
 */
function setSwagger(app: NestExpressApplication) {
  const config = new DocumentBuilder()
    .setTitle('The Hospital Appointments API')
    .setDescription('The Hospital Appointments API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
    operationIdFactory: (controllerKey: string, methodKey: string) => {
      return snakeCase(methodKey).replace(/_/g, ' ');
    },
  });

  SwaggerModule.setup('api/v1/doc', app, document);
}

/**
 * Bootstrap the application
 */
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const redisService = app.get<RedisService>(REDIS_CONNECTION);
  const configService = app.get(ConfigService);

  const PORT = configService.get<number>('BACKEND_SERVICE_PORT');

  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  app.use(
    helmet({
      xssFilter: true, // XSS attack
      frameguard: true, // Clickjacking
      hsts: true, // HTTP Strict Transport Security
      noSniff: true, // MIME sniffing
      hidePoweredBy: true, // Hide X-Powered-By
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors = exceptionFactory(errors);
        return new UnprocessableEntityException({
          statusCode: 422,
          message: 'Validation failed',
          validationErrors: formattedErrors,
        });
      },
    }),
  );

  /**
   * Session configuration
   */
  app.use(
    sessions({
      store: new RedisStore({
        client: redisService,
        prefix: 'has-session#',
      }),
      name: 'has-session',
      secret: configService.get<string>('SESSION_SECRET'),
      cookie: {
        httpOnly: true,
        maxAge: configService.get<number>('SESSION_EXPIRATION') * 1000,
        secure: configService.get<string>('NODE_ENV') === 'production',
        sameSite: 'lax',
      },
      resave: true,
      saveUninitialized: false,
    }),
  );

  setSwagger(app);

  await app.listen(PORT).then(() => {
    Logger.log(bold.bgGreen(`Backend service is running on port ${PORT}`));
  });
}

bootstrap();
