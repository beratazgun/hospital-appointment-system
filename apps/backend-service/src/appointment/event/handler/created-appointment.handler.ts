import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { CreatedAppointmentEvent } from '@backend/appointment/event/impl/created-appointment.impl';
import { RabbitmqService } from '@common/modules/rabbitmq/rabbitmq.service';
import { PrismaService } from '@common';
import { EmailTemplateType } from '@common/modules/rabbitmq/types';
import { format } from 'date-fns';
import { GlobalRepository } from '@backend/global/repository/global.repository';

@EventsHandler(CreatedAppointmentEvent)
export class CreatedAppointmentHandler
  implements IEventHandler<CreatedAppointmentEvent>
{
  constructor(
    private readonly rabbitmq: RabbitmqService,
    private readonly globalRepository: GlobalRepository,
  ) {}

  async handle(event: CreatedAppointmentEvent) {
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
        'CREATED_APPOINTMENT',
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
