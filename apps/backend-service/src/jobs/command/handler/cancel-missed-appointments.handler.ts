import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CancelMissedAppointmentsCommand } from '@backend/jobs/command/impl/cancel-missed-appointments.impl';
import { JobsRepository } from '@backend/jobs/repository/jobs.repository';
import { RabbitmqService } from '@common/modules/rabbitmq/rabbitmq.service';
import { GlobalRepository } from '@backend/global/repository/global.repository';
import { EmailTemplateType } from '@common/modules/rabbitmq/types';
import { format } from 'date-fns';

@CommandHandler(CancelMissedAppointmentsCommand)
export class CancelMissedAppointmentsHandler
  implements ICommandHandler<CancelMissedAppointmentsCommand>
{
  constructor(
    private readonly publisher: EventPublisher,
    private jobsRepository: JobsRepository,
    private readonly rabbitmq: RabbitmqService,
    private readonly globalRepository: GlobalRepository,
  ) {}

  async execute(command: CancelMissedAppointmentsCommand) {
    const missedAppointments =
      await this.jobsRepository.getMissedAppointments();

    const emailTemplate =
      await this.globalRepository.getNotificationTemplateByCodeAndType(
        'CANCELLED_APPOINTMENT_BY_SYSTEM',
        'EMAIL',
      );

    for (const element of missedAppointments) {
      const {
        Hospital: { name: hospitalName, address: hospitalAddress },
        Polyclinic: { name: polyclinicName },
        fullName: doctorFullName,
      } = element.Doctor;

      await this.rabbitmq.publish<EmailTemplateType>(
        'notification',
        'notification.email',
        {
          to: [element.Patient.email],
          templateParams: {
            FULL_NAME: element.Patient.fullName,
            HOSPITAL_NAME: hospitalName,
            POLYCLINIC_NAME: polyclinicName,
            APPOINTMENT_DATE: format(
              new Date(element.AppointmentSlot.appointmentDate),
              'yyyy-MM-dd HH:mm:ss',
            ),
            HOSPITAL_ADDRESS: hospitalAddress,
            DOCTOR_NAME: doctorFullName,
          },
          template: emailTemplate,
        },
      );
    }

    await this.jobsRepository.cancelMissedAppointments(missedAppointments);
  }
}
