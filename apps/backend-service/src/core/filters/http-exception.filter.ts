import { HTTPStatusCodeType } from '@common/constants';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const status = exception.getStatus() as HTTPStatusCodeType;
    const response = ctx.getResponse<Response>();

    return response.status(status).json(exception.getResponse());
  }
}
