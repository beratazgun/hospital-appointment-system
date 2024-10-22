import { Request } from 'express';

export class CreateAppointmentCommand {
  constructor(
    public appointmentSlotCode: string,
    public req: Request,
  ) {}
}
