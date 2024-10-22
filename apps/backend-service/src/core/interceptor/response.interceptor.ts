import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, map, tap, timeout } from 'rxjs/operators';
import { Response } from 'express';
import { HttpResponse } from '@common/helpers/http-response';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(30000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => err);
      }),
      map((response: HttpException | HttpResponse) => {
        const res = context.switchToHttp().getResponse<Response>();

        if (
          response instanceof HttpException ||
          response instanceof HttpResponse
        ) {
          res.status(response.getStatus()).json(response.getResponse());
        } else {
          return response;
        }
      }),
    );
  }
}
