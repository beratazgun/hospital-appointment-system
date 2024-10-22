import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendEmailForUpcomingAppointmentsCommand } from '@backend/jobs/command/impl/send-email-for-upcoming-appointments.impl';
import { JobsRepository } from '@backend/jobs/repository/jobs.repository';
import { format } from 'date-fns';
import { RabbitmqService } from '@common/modules/rabbitmq/rabbitmq.service';
import { EmailTemplateType } from '@common/modules/rabbitmq/types';
import { GlobalRepository } from '@backend/global/repository/global.repository';

@CommandHandler(SendEmailForUpcomingAppointmentsCommand)
export class SendEmailForUpcomingAppointmentsHandler
  implements ICommandHandler<SendEmailForUpcomingAppointmentsCommand>
{
  constructor(
    private readonly jobsRepository: JobsRepository,
    private readonly rabbitmq: RabbitmqService,
    private readonly globalRepository: GlobalRepository,
  ) {}

  async execute(command: SendEmailForUpcomingAppointmentsCommand) {
    const upcomingAppointments =
      await this.jobsRepository.getUpcomingAppointments();

    const emailTemplate =
      await this.globalRepository.getNotificationTemplateByCodeAndType(
        'UPCOMING_APPOINTMENT_REMINDER',
        'EMAIL',
      );

    for (const element of upcomingAppointments) {
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

    /**
     * Update 'isUpcomingAppointmentReminderMailSent' field to true
     */
    await this.jobsRepository.updateScheduledAppointment(
      upcomingAppointments.map((appointment) => appointment.id),
    );
  }
}
