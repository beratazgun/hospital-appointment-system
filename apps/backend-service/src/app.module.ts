import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaClientKnownRequestErrorFilter } from './core/filters/prisma-client-known-request-error.filter';
import { PrismaClientValidationErrorFilter } from './core/filters/prisma-client-validation-error.filter';
import { HttpExceptionFilter } from '@backend/core/filters/http-exception.filter';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { ResponseInterceptor } from './core/interceptor/response.interceptor';
import { DoctorsModule } from './doctors/doctors.module';
import { AppointmentModule } from './appointment/appointment.module';
import { JobsModule } from './jobs/jobs.module';
import { PrismaClientUnknownRequestErrorFilter } from './core/filters/prisma-client-unknown-request-error.filter';
import { UserModule } from './user/user.module';
import { LoggingInterceptor } from './core/interceptor/logger.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ` ${
        process.env.NODE_ENV === 'development'
          ? './config/.env.development'
          : './config/.env.production'
      }`,
    }),
    AuthModule,
    SharedModule,
    DoctorsModule,
    AppointmentModule,
    JobsModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: PrismaClientKnownRequestErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: PrismaClientValidationErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: PrismaClientUnknownRequestErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
