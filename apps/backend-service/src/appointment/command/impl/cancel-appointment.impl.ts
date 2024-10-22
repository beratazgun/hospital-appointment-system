import { Request } from 'express';

export class CancelAppointmentCommand {
  constructor(
    public appointmentSlotCode: string,
    public req: Request,
  ) {}
}
