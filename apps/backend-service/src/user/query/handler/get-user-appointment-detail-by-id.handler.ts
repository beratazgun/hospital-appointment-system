import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUserAppointmentDetailByIdQuery } from '@backend/user/query/impl/get-user-appointment-detail-by-id.impl';
import { HttpResponse } from '@common/helpers/http-response';
import { UserRepository } from '@backend/user/repository/user.repository';
import { BadRequestException } from '@nestjs/common';
import { omit } from 'lodash';

@QueryHandler(GetUserAppointmentDetailByIdQuery)
export class GetUserAppointmentDetailByIdHandler
  implements IQueryHandler<GetUserAppointmentDetailByIdQuery>
{
  constructor(private userRepository: UserRepository) {}

  async execute(event: GetUserAppointmentDetailByIdQuery) {
    const { appointmentSlotCode, req } = event;

    const isUserHaveAppointment =
      await this.userRepository.isUserHaveAppointment(
        appointmentSlotCode,
        req.session.user.id,
      );

    if (!isUserHaveAppointment) {
      return new BadRequestException('User does not have this appointment');
    }

    const result = await this.userRepository.getUserAppointmentDetailByID(
      isUserHaveAppointment.id,
      req.session.user.id,
    );

    return new HttpResponse(200, {
      appointment: {
        fullName: result.Doctor.fullName,
        doctorCode: result.Doctor.doctorCode,
        hospital: omit(result.Doctor.Hospital, ['id']),
        polyclinic: omit(result.Doctor.Polyclinic, ['id']),
        appointmentApprovedAt: result.appointmentApprovedAt,
        appointmentDate: result.AppointmentSlot.appointmentDate,
        appointmentStatus: result.appointmentStatus,
      },
    });
  }
}
