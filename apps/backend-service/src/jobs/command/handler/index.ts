import { CancelMissedAppointmentsHandler } from './cancel-missed-appointments.handler';
import { CreateAppointmentSlotHandler } from './create-appointment-slot.handler';
import { SendEmailForUpcomingAppointmentsHandler } from './send-email-for-upcoming-appointments.handler';;

export const JobsCommandHandlers = [CancelMissedAppointmentsHandler,
CreateAppointmentSlotHandler,
SendEmailForUpcomingAppointmentsHandler,];
