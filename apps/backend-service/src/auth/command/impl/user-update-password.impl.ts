import { UpdatePasswordBodyDto } from '@backend/auth/dtos';
import { Request } from 'express';

export class UserUpdatePasswordCommand {
  constructor(
    public body: UpdatePasswordBodyDto,
    public req: Request,
  ) {}
}
