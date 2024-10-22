import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUserAppointmentsQuery } from '@backend/user/query/impl/get-user-appointments.impl';
import { UserRepository } from '@backend/user/repository/user.repository';
import { HttpResponse } from '@common/helpers/http-response';
import { differenceInDays } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
@QueryHandler(GetUserAppointmentsQuery)
export class GetUserAppointmentsHandler
  implements IQueryHandler<GetUserAppointmentsQuery>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(event: GetUserAppointmentsQuery) {
    const { req, query } = event;

    const usersAppointments =
      await this.userRepository.getUserAppointmentsByUserID(
        req.session.user.id,
        query,
      );

    const isUpcoming = (appointmentDate: string) =>
      differenceInDays(
        new Date(appointmentDate),
        toZonedTime(new Date(), 'Europe/Istanbul'),
      ) < 1;

    const modifiedResponseData = [
      ...usersAppointments.docs.map((appointment) => ({
        doctorName: appointment.Doctor.fullName,
        appointmentDate: appointment.AppointmentSlot.appointmentDate,
        hospitalName: appointment.Doctor.Hospital.name,
        polyclinicName: appointment.Doctor.Polyclinic.name,
        status: appointment.appointmentStatus,
        hospitalAddress: appointment.Doctor.Hospital.address,
        isCompleted: appointment.appointmentStatus === 'COMPLETED',
        isCancelled: appointment.appointmentStatus === 'CANCELLED',
        isUpcoming: isUpcoming(
          appointment.AppointmentSlot.appointmentDate.toISOString(),
        ),
      })),
    ];

    return new HttpResponse(200, {
      payload: {
        ...usersAppointments,
        docs: modifiedResponseData,
      },
    });
  }
}
