import { Request } from 'express';

export class GetUserQuery {
  constructor(public readonly req: Request) {}
}
