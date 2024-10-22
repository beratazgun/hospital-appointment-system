import { GetUserAppointmentDetailByIdHandler } from './get-user-appointment-detail-by-id.handler';
import { GetUserAppointmentsHandler } from './get-user-appointments.handler';
import { GetUserHandler } from './get-user.handler';;

export const UserQueryHandlers = [GetUserAppointmentDetailByIdHandler,
GetUserAppointmentsHandler,
GetUserHandler,];
