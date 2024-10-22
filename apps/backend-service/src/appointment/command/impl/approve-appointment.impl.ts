import { Request } from 'express';

export class ApproveAppointmentCommand {
  constructor(
    public appointmentSlotCode: string,
    public req: Request,
  ) {}
}
