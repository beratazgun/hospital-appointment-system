import { GetUserAppointmentsQueryDto } from '@backend/user/dtos/get-user-appointments.query.dto';

import { Request } from 'express';

export class GetUserAppointmentsQuery {
  constructor(
    public req: Request,
    public query: GetUserAppointmentsQueryDto,
  ) {}
}
