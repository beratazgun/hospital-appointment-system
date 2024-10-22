import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { ApprovedAppointmentEvent } from '@backend/appointment/event/impl/approved-appointment.impl';
import { RabbitmqService } from '@common/modules/rabbitmq/rabbitmq.service';
import { GlobalRepository } from '@backend/global/repository/global.repository';
import { EmailTemplateType } from '@common/modules/rabbitmq/types';
import { intlFormat } from 'date-fns';

@EventsHandler(ApprovedAppointmentEvent)
export class ApprovedAppointmentHandler
  implements IEventHandler<ApprovedAppointmentEvent>
{
  constructor(
    private readonly rabbitmq: RabbitmqService,
    private readonly globalRepository: GlobalRepository,
  ) {}

  async handle(event: ApprovedAppointmentEvent) {
    const { fullName, patientEmail, appointmentDate } = event;

    const emailTemplate =
      await this.globalRepository.getNotificationTemplateByCodeAndType(
        'APPROVED_APPOINTMENT',
        'EMAIL',
      );

    await this.rabbitmq.publish<EmailTemplateType>(
      'notification',
      'notification.email',
      {
        to: [patientEmail],
        templateParams: {
          FULL_NAME: fullName,
          APPOINTMENT_DATE: intlFormat(new Date(appointmentDate), {
            dateStyle: 'full',
            timeStyle: 'short',
          }),
        },
        template: emailTemplate,
      },
    );
  }
}
