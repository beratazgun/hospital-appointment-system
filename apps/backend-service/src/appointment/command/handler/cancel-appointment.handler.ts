import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CancelAppointmentCommand } from '@backend/appointment/command/impl/cancel-appointment.impl';
import { AppointmentRepository } from '@backend/appointment/repository/appointment.repository';
import { BadRequestException } from '@nestjs/common';
import { HttpResponse } from '@common/helpers/http-response';
import {
  AppointmentSlot,
  Doctor,
  Hospital,
  Polyclinic,
  Appointment,
} from '@prisma/client';
import { appointmentModelInstance } from '@backend/appointment/model/appointment.model';

@CommandHandler(CancelAppointmentCommand)
export class CancelAppointmentHandler
  implements ICommandHandler<CancelAppointmentCommand>
{
  constructor(
    private readonly publisher: EventPublisher,
    private readonly appointmentRepository: AppointmentRepository,
  ) {}

  async execute(command: CancelAppointmentCommand) {
    const { req, appointmentSlotCode } = command;

    const appointmentModelContext = this.publisher.mergeObjectContext(
      appointmentModelInstance,
    );

    const checkAppointmentExists =
      await this.appointmentRepository.isAppointmentTaken(
        appointmentSlotCode,
        req.session.user.id,
      );

    if (!checkAppointmentExists) {
      return new BadRequestException(
        'Appointment does not exist or already cancelled',
      );
    }

    const cancelledAppointment =
      await this.appointmentRepository.cancelAppointment(
        checkAppointmentExists.AppointmentSlot.appointmentSlotCode,
        req.session.user.id,
      );

    const appointmentDetail = this.generateAppointmentDetail(
      cancelledAppointment,
      req.session.user.fullName,
    );

    /**
     * trigger event to send email after cancelled appointment
     */
    appointmentModelContext.sendEmailAfterCancelledAppointment({
      patientEmail: req.session.user.email,
      ...appointmentDetail,
    });
    appointmentModelContext.commit();

    return new HttpResponse(200, {
      message: 'Appointment cancelled successfully',
      payload: {
        appointmentSlotCode,
      },
    });
  }

  /**
   * Generate appointment detail
   */
  generateAppointmentDetail(
    createdAppointment: Appointment & {
      AppointmentSlot: AppointmentSlot & {
        Doctor: Doctor & {
          Hospital: Hospital;
          Polyclinic: Polyclinic;
        };
        appointmentDate: Date;
      };
    },
    userFullName: string,
  ) {
    const {
      Hospital: { name: hospitalName, address: hospitalAddress },
      Polyclinic: { name: polyclinicName },
      fullName: doctorFullName,
    } = createdAppointment.AppointmentSlot.Doctor;

    const appointmentDetail = {
      fullName: userFullName,
      hospitalName: hospitalName,
      hospitalAddress: hospitalAddress,
      polyclinicName: polyclinicName,
      appointmentDate:
        createdAppointment.AppointmentSlot.appointmentDate.toISOString(),
      doctorName: doctorFullName,
    };

    return appointmentDetail;
  }
}
