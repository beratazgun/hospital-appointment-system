import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { ApproveAppointmentCommand } from '@backend/appointment/command/impl/approve-appointment.impl';
import { HttpResponse } from '@common/helpers/http-response';
import { AppointmentRepository } from '@backend/appointment/repository/appointment.repository';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { isAfter, isBefore } from 'date-fns';
import { appointmentModelInstance } from '@backend/appointment/model/appointment.model';
import { toZonedTime } from 'date-fns-tz';

@CommandHandler(ApproveAppointmentCommand)
export class ApproveAppointmentHandler
  implements ICommandHandler<ApproveAppointmentCommand>
{
  constructor(
    private readonly publisher: EventPublisher,
    private readonly appointmentRepository: AppointmentRepository,
  ) {}

  async execute(command: ApproveAppointmentCommand) {
    const { appointmentSlotCode, req } = command;

    const { fullName, email, id: userID } = req.session.user;

    const appointmentContext = this.publisher.mergeObjectContext(
      appointmentModelInstance,
    );

    const isAppointmentExist =
      await this.appointmentRepository.isAppointmentTaken(
        appointmentSlotCode,
        userID,
      );

    if (!isAppointmentExist) {
      return new BadRequestException(
        'You have not booked any appointment or already approved',
      );
    }

    if (
      !isAfter(
        toZonedTime(new Date(), 'Europe/Istanbul'),
        isAppointmentExist.upcomingAppointmentApproveDate,
      ) &&
      isBefore(
        toZonedTime(new Date(), 'Europe/Istanbul'),
        isAppointmentExist.AppointmentSlot.appointmentDate,
      )
    ) {
      return new BadRequestException(
        'You can only approve the appointment 8 hours before the appointment date.',
      );
    }

    await this.appointmentRepository.approveAppointment(
      isAppointmentExist.id,
      userID,
    );

    appointmentContext.sendEmailAfterApprovedAppointment(
      fullName,
      email,
      isAppointmentExist.AppointmentSlot.appointmentDate,
    );
    appointmentContext.commit();

    return new HttpResponse(200, {
      message: 'Appointment approved successfully',
    });
  }
}
