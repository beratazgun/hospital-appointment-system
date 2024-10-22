import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { HttpResponse } from '@common/helpers/http-response';
import { HTTPStatusCodeType } from '@common/constants';
import { HTTP_STATUS_LOG_LEVELS_MAP } from '@common/constants/http_status_log_levels';
import { LOG_LEVELS_ENUM } from '@common/constants/log-levels';
import { LogControllerProcessSchema } from '@backend/core/schema/log-controller-process.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { toZonedTime } from 'date-fns-tz';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @InjectModel(LogControllerProcessSchema.name, 'logs')
    private controllerLogProcessModel: Model<LogControllerProcessSchema>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap({
        next: async (response: HttpException | HttpResponse) => {
          const req = context.switchToHttp().getRequest<Request>();

          const prepareLogEntry = this.createLogEntry(req, response, context);

          await this.controllerLogProcessModel.create(prepareLogEntry);
        },
        error: (err) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('err', err);
          }
        },
      }),
    );
  }

  protected LogLevelFinder(statusCode: HTTPStatusCodeType) {
    return HTTP_STATUS_LOG_LEVELS_MAP.get(statusCode);
  }

  protected createLogEntry(
    req: Request,
    res: HttpException | HttpResponse,
    context: ExecutionContext,
  ) {
    const reqBody = req.body;
    const reqHeader = req.headers;
    const reqQuery = req.query;
    const reqUrl = req.url;
    const reqMethod = req.method;
    const reqHost = req.hostname;
    const resStatus = res.getStatus() as HTTPStatusCodeType;
    const resPayload = res.getResponse();
    const handlerName = context.getHandler().name;
    const controllerName = context.getClass().name;
    const session = req.session.user;

    return {
      controllerName,
      actionType: `${controllerName}->${handlerName}`,
      logLevel: this.LogLevelFinder(resStatus) || LOG_LEVELS_ENUM.INFO,
      userAgent: reqHeader['user-agent'],
      response: {
        statusCode: resStatus,
        payload: resPayload,
      },
      request: {
        url: reqHost + reqUrl,
        method: reqMethod,
        headers: reqHeader,
        body: reqBody,
        query: reqQuery,
      },
      userID: session?.id || null,
      createdAt: toZonedTime(new Date(), 'Europe/Istanbul'),
    };
  }
}
