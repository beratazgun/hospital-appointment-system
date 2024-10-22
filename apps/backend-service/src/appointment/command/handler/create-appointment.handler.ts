import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateAppointmentCommand } from '@backend/appointment/command/impl/create-appointment.impl';
import { HttpResponse } from '@common/helpers/http-response';
import { AppointmentRepository } from '@backend/appointment/repository/appointment.repository';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { appointmentModelInstance } from '@backend/appointment/model/appointment.model';
import {
  AppointmentSlot,
  Doctor,
  Hospital,
  Polyclinic,
  Appointment,
} from '@prisma/client';
import { isAfter } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
@CommandHandler(CreateAppointmentCommand)
export class CreateAppointmentHandler
  implements ICommandHandler<CreateAppointmentCommand>
{
  constructor(
    private publisher: EventPublisher,
    private appointmentRepository: AppointmentRepository,
  ) {}

  async execute(command: CreateAppointmentCommand) {
    const { req, appointmentSlotCode } = command;

    const appointmentModelContext = this.publisher.mergeObjectContext(
      appointmentModelInstance,
    );

    const isAppointmentExist =
      await this.appointmentRepository.checkAppointmentExists(
        appointmentSlotCode,
      );

    /**
     * Check if appointment does not exist or already booked
     */
    if (!isAppointmentExist) {
      return new ConflictException(
        'Appointment does not exist or already booked',
      );
    }

    /**
     * Check if appointment date is already passed
     */
    // if (
    //   isAfter(
    //     toZonedTime(new Date(), 'Europe/Istanbul'),
    //     isAppointmentExist.appointmentDate,
    //   )
    // ) {
    //   return new BadRequestException('Appointment date is already passed');
    // }

    const checkUserOtherAppointment =
      await this.appointmentRepository.checkUserOtherAppointments(
        isAppointmentExist.appointmentDate,
        req.session.user.id,
      );

    /**
     * Check if user has another appointment scheduled for this date
     */
    if (checkUserOtherAppointment) {
      return new ConflictException(
        'You have another appointment scheduled for this date. Please try another date',
      );
    }

    const createdAppointment =
      await this.appointmentRepository.createAppointment(
        isAppointmentExist.id,
        req.session.user.id,
      );

    const appointmentDetail = this.generateAppointmentDetail(
      createdAppointment,
      req.session.user.fullName,
    );

    appointmentModelContext.sendEmailAfterCreatedAppointment({
      patientEmail: req.session.user.email,
      ...appointmentDetail,
    });
    appointmentModelContext.commit();

    return new HttpResponse(200, {
      message: 'Appointment created successfully',
      payload: appointmentDetail,
    });
  }

  /**
   * Generate appointment detail
   */
  private generateAppointmentDetail(
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
