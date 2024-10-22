import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch(PrismaClientValidationError)
export class PrismaClientValidationErrorFilter extends BaseExceptionFilter {
  constructor() {
    super();
  }

  catch(exception: PrismaClientValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    /**
     * For development environment, log the error message
     */
    if (process.env.NODE_ENV === 'development') {
      console.log(
        'PrismaClientValidationErrorFilter',
        exception.message.split('\n').reverse()[0],
        '--',
      );
    }

    // TODO: rabbitMQ ya log bırakılacak

    if (exception.name === 'PrismaClientValidationError') {
      const message = exception.message.split('\n').reverse()[0];
      const properyName = message.split(' ')[1];

      response.status(400).json({
        httpStatusCode: 400,
        httpStatus: 'BAD_REQUEST',
        validationErrors: [
          {
            property: properyName,
            constraints: exception.message.split('\n').reverse()[0],
          },
        ],
      });
    } else {
      exception instanceof HttpException ? exception.getStatus() : 500;
    }
  }
}
