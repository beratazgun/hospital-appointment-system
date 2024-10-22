import { Request } from 'express';

export class GetUserAppointmentDetailByIdQuery {
  constructor(
    public appointmentSlotCode: string,
    public req: Request,
  ) {}
}
