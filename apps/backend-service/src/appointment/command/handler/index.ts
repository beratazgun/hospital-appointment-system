import { ApproveAppointmentHandler } from './approve-appointment.handler';
import { CancelAppointmentHandler } from './cancel-appointment.handler';
import { CreateAppointmentHandler } from './create-appointment.handler';

export const AppointmentCommandHandlers = [
  ApproveAppointmentHandler,
  CancelAppointmentHandler,
  CreateAppointmentHandler,
];
