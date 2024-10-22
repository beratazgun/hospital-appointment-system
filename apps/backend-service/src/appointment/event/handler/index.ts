import { ApprovedAppointmentHandler } from './approved-appointment.handler';
import { CancelledAppointmentHandler } from './cancelled-appointment.handler';
import { CreatedAppointmentHandler } from './created-appointment.handler';;

export const AppointmentEventHandlers = [ApprovedAppointmentHandler,
CancelledAppointmentHandler,
CreatedAppointmentHandler,];
