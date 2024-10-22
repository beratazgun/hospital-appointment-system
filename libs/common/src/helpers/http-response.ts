import { HTTP_STATUS_MAP, HTTPStatusCodeType } from '@common/constants';

export class HttpResponse {
  constructor(
    protected readonly statusCode: HTTPStatusCodeType,
    protected readonly response?: {
      [key: string]: unknown;
    },
  ) {
    this.statusCode = statusCode;
    this.response = response;
  }

  getStatus(): HTTPStatusCodeType {
    return this.statusCode;
  }

  getResponse(): Record<string, unknown> {
    return {
      statusCode: this.statusCode,
      status: HTTP_STATUS_MAP.get(this.statusCode),
      ...this.response,
    };
  }
}
