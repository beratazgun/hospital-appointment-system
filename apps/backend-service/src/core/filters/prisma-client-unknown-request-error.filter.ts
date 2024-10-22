import { ArgumentsHost, Catch } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { EnvType } from '@Root/config/env.validation';
import { Response } from 'express';

@Catch(PrismaClientUnknownRequestError)
export class PrismaClientUnknownRequestErrorFilter extends BaseExceptionFilter {
  constructor(private configService: ConfigService<EnvType>) {
    super();
  }

  catch(exception: PrismaClientUnknownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    /**
     *  In development mode, we want to show the error message to the client.
     */
    if (this.configService.get('NODE_ENV') === 'development') {
      response.status(500).json({
        httpStatusCode: 500,
        error: exception.message,
      });
    }

    response.status(400).json({
      httpStatusCode: 400,
      error: 'Something went wrong.',
    });
  }
}
