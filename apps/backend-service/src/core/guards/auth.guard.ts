import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authorizationToken = this.extractTokenFromHeader(request);

    if (!authorizationToken) {
      throw new UnauthorizedException(
        'Authorization token is required to access this resource',
      );
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (!type || !token) {
      throw new UnauthorizedException(
        'Authorization token is required to access this resource',
      );
    }

    const getFirstSegmentOfToken = token.split('.')[0].slice(2);

    if (getFirstSegmentOfToken !== request.session.id) {
      throw new UnauthorizedException('Invalid authorization token provided');
    }

    return type === 'Bearer' ? token : undefined;
  }
}
