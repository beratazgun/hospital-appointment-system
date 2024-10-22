import { HTTPStatusCodeType, HttpStatusValuesType } from '@common/constants';
import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

interface ErrorMapping {
  description: string;
  status: HttpStatusValuesType;
  statusCode: HTTPStatusCodeType;
  prismaErrorCode: string;
}

export const knownRequestErrorMappings: Record<string, ErrorMapping> = {
  P2000: {
    description:
      "The provided value for the column is too long for the column's type. Column: {column_name}",
    statusCode: 400,
    status: 'BAD_REQUEST',
    prismaErrorCode: 'P2000',
  },
  P2002: {
    description: 'Unique constraint failed on the {constraint}',
    statusCode: 409,
    status: 'CONFLICT',
    prismaErrorCode: 'P2002',
  },
  P2003: {
    description: 'Foreign key constraint failed on the field: {field_name}',
    statusCode: 400,
    status: 'BAD_REQUEST',
    prismaErrorCode: 'P2003',
  },
  P2025: {
    description:
      'An operation failed because it depends on one or more records that were required but not found. {cause}',
    statusCode: 400,
    status: 'BAD_REQUEST',
    prismaErrorCode: 'P2025',
  },
  P2014: {
    description:
      "The change you are trying to make would violate the required relation '{relation_name}' between the {model_a_name} and {model_b_name} models.",
    statusCode: 400,
    status: 'BAD_REQUEST',
    prismaErrorCode: 'P2014',
  },
  P2022: {
    description: 'The column {column} does not exist in the current database.',
    statusCode: 400,
    status: 'BAD_REQUEST',
    prismaErrorCode: 'P2022',
  },
};

@Catch(PrismaClientKnownRequestError)
export class PrismaClientKnownRequestErrorFilter extends BaseExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorMapping = knownRequestErrorMappings[exception.code];

    if (process.env.NODE_ENV === 'development') {
      console.error(exception);
      console.log('*'.repeat(50));
    }

    if (errorMapping) {
      const { statusCode, status } = errorMapping;

      // TODO: RabbitMQ ya log bırakılacak
      response.status(statusCode).json({
        httpStatusCode: statusCode,
        httpStatus: status,
        error: this.errorMatcher(errorMapping, exception),
      });
    }
  }

  /**
   * TODO: Error mapping refactor edilecek
   */
  errorMatcher(
    errorMapping: ErrorMapping,
    exception: PrismaClientKnownRequestError,
  ) {
    const { prismaErrorCode } = errorMapping;

    switch (prismaErrorCode) {
      case 'P2000':
        return {
          property: exception.meta.target[0],
          message: `${exception.meta.target[0]} is invalid.`,
        };
      case 'P2002':
        return {
          property: exception.meta.target[0],
          message: `${exception.meta.target[0]} is already taken.`,
        };
      case 'P2003':
        return {
          property: exception.meta.field_name,
          message: `Foreign key constraint failed on the field: ${
            exception.meta.field_name.toString().split('_')[1]
          }`,
        };
      case 'P2025':
        return {
          property: exception.meta.modelName,
          message: `${exception.meta.cause}`,
        };
      case 'P2022':
        return {
          property: exception.meta.column,
          message: errorMapping.description.replace(
            '{column}',
            `/${exception.meta.column}/` as string,
          ),
        };

      default:
        return {
          property: 'unknown',
          message: 'An unknown error occurred.',
        };
    }
  }
}
