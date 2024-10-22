import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { CancelledAppointmentEvent } from '@backend/appointment/event/impl/cancelled-appointment.impl';
import { RabbitmqService } from '@common/modules/rabbitmq/rabbitmq.service';
import { PrismaService } from '@common';
import { EmailTemplateType } from '@common/modules/rabbitmq/types';
import { format } from 'date-fns';
import { GlobalRepository } from '@backend/global/repository/global.repository';

@EventsHandler(CancelledAppointmentEvent)
export class CancelledAppointmentHandler
  implements IEventHandler<CancelledAppointmentEvent>
{
  constructor(
    private readonly rabbitmq: RabbitmqService,
    private readonly globalRepository: GlobalRepository,
  ) {}

  async handle(event: CancelledAppointmentEvent) {
    const {
      patientEmail,
      fullName,
      hospitalName,
      polyclinicName,
      appointmentDate,
      hospitalAddress,
      doctorName,
    } = event;

    const emailTemplate =
      await this.globalRepository.getNotificationTemplateByCodeAndType(
        'CANCELLED_APPOINTMENT',
        'EMAIL',
      );

    await this.rabbitmq.publish<EmailTemplateType>(
      'notification',
      'notification.email',
      {
        to: [patientEmail],
        templateParams: {
          FULL_NAME: fullName,
          HOSPITAL_NAME: hospitalName,
          POLYCLINIC_NAME: polyclinicName,
          APPOINTMENT_DATE: format(
            new Date(appointmentDate),
            'yyyy-MM-dd HH:mm:ss',
          ),
          HOSPITAL_ADDRESS: hospitalAddress,
          DOCTOR_NAME: doctorName,
        },
        template: emailTemplate,
      },
    );
  }
}
