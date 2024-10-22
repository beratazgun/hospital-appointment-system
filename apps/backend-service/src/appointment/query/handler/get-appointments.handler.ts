import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetAppointmentsQuery } from '@backend/appointment/query/impl/get-appointments.impl';
import { AppointmentRepository } from '@backend/appointment/repository/appointment.repository';
import { HttpResponse } from '@common/helpers/http-response';
import { format, intlFormat } from 'date-fns';
import { groupBy } from 'lodash';

@QueryHandler(GetAppointmentsQuery)
export class GetAppointmentsHandler
  implements IQueryHandler<GetAppointmentsQuery>
{
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  async execute(event: GetAppointmentsQuery) {
    const { query } = event;

    let getAppointments =
      await this.appointmentRepository.getAppointments(query);

    const modifiedAppointments = getAppointments.docs.map((doc) => {
      const groupedAppointments = groupBy(doc.AppointmentSlot, (slot) => {
        return format(slot.appointmentDate, 'yyyy-MM-dd');
      });

      const appointments = [
        ...Object.keys(groupedAppointments).map((key) => {
          return {
            date: key,
            beautifiedDate: intlFormat(new Date(key), {
              dateStyle: 'full',
              timeStyle: 'short',
            }),
            slots: groupedAppointments[key].map((slot) => {
              return {
                time: format(slot.appointmentDate, 'HH:mm'),
                status: slot.status,
                appointmentSlotCode: slot.appointmentSlotCode,
              };
            }),
          };
        }),
      ];

      return {
        doctorCode: doc.doctorCode,
        doctorFullName: doc.fullName,
        hospital: {
          name: doc.Hospital?.name,
          address: doc.Hospital?.address,
          hospitalCode: doc.Hospital?.hospitalCode,
        },
        polyclinicName: doc.Polyclinic?.name,
        appointments,
      };
    });

    return new HttpResponse(200, {
      pagination: getAppointments.pagination,
      doc: modifiedAppointments,
    });
  }
}
