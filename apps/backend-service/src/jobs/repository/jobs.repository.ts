import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/modules/prisma/prisma.service';
import {
  addDays,
  differenceInDays,
  endOfDay,
  endOfHour,
  startOfDay,
  startOfHour,
} from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
@Injectable()
export class JobsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Create Available Appointment Slots
   */
  public async createAvailableAppointmentSlots(
    appointmentSlots: {
      appointmentSlotCode: string;
      appointmentDate: Date;
      doctorID: number;
    }[],
  ) {
    await this.prismaService.appointmentSlot.createMany({
      data: appointmentSlots,
      skipDuplicates: true,
    });
  }

  /**
   * Get Upcoming Appointments
   *  differenceInDays(new Date(appointmentDate), toZonedTime(new Date(), 'Europe/Istanbul')) < 1;
   */
  public async getUpcomingAppointments() {
    return await this.prismaService.appointment.findMany({
      where: {
        appointmentStatus: 'SCHEDULED',
        AppointmentSlot: {
          appointmentDate: {
            gte: startOfDay(toZonedTime(new Date(), 'Europe/Istanbul')),
            lte: addDays(
              endOfDay(toZonedTime(new Date(), 'Europe/Istanbul')),
              1,
            ),
          },
        },
        isUpcomingAppointmentReminderMailSent: false,
      },
      include: {
        Patient: true,
        Doctor: {
          include: {
            Hospital: true,
            Polyclinic: true,
          },
        },
        AppointmentSlot: true,
      },
    });
  }

  /**
   * Update Appointment Slot. It will update the isUpcomingAppointmentReminderMailSent field to true. Because we have sent the reminder mail. İt will not send again.
   */
  public async updateScheduledAppointment(scheduledAppointmentID: number[]) {
    return await this.prismaService.appointment.updateMany({
      where: {
        id: {
          in: scheduledAppointmentID,
        },
      },
      data: {
        isUpcomingAppointmentReminderMailSent: true,
      },
    });
  }

  /**
   * Cancel Missed Appointments
   */
  public async cancelMissedAppointments(missedAppointments: any[]) {
    await this.prismaService.$transaction(async (ts) => {
      await ts.appointmentSlot.updateMany({
        where: {
          id: {
            in: missedAppointments.map(
              (appointment) => appointment.AppointmentSlot.id,
            ),
          },
        },
        data: {
          status: 'CANCELLED_BY_SYSTEM',
        },
      });

      await ts.appointment.updateMany({
        where: {
          id: {
            in: missedAppointments.map((appointment) => appointment.id),
          },
        },
        data: {
          appointmentStatus: 'CANCELLED',
        },
      });

      return missedAppointments.map((appointment) => {
        return {
          patientEmail: appointment.Patient.email,
          fullname: appointment.Patient.fullName,
          hospitalName: appointment.Doctor.Hospital.name,
          polyclinicName: appointment.Doctor.Polyclinic.name,
          doctorName: appointment.Doctor.fullName,
          appointmentDate: appointment.AppointmentSlot.appointmentDate,
          hospitalAddress: appointment.Doctor.Hospital.address,
        };
      });
    });
  }

  /**
   * Get Missed Appointments
   */
  public async getMissedAppointments() {
    return await this.prismaService.appointment.findMany({
      where: {
        appointmentStatus: {
          in: ['SCHEDULED', 'APPROVED'],
        },
        AppointmentSlot: {
          appointmentDate: {
            lt: startOfHour(toZonedTime(new Date(), 'Europe/Istanbul')),
          },
        },
      },
      include: {
        AppointmentSlot: true,
        Patient: true,
        Doctor: {
          include: {
            Hospital: true,
            Polyclinic: true,
          },
        },
      },
    });
  }
}
