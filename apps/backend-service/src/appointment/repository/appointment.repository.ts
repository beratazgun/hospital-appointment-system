import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/modules/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { GetAppointmentsQueryDto } from '../dtos';
import { Paginator } from '@backend/core/helpers/paginator';
import { endOfDay, subDays, subHours } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
@Injectable()
export class AppointmentRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private paginator: Paginator,
  ) {}

  /**
   * Check if the appointment exists and before taking any action
   */
  async checkAppointmentExists(appointmentSlotCode: string) {
    return await this.prismaService.appointmentSlot.findUnique({
      where: {
        appointmentSlotCode,
        status: 'AVAILABLE',
        Doctor: {
          id: Number(appointmentSlotCode.split('-')[1]),
        },
      },
      select: {
        id: true,
        appointmentDate: true,
        status: true,
      },
    });
  }

  /**
   * Create Appointment.
   */
  async createAppointment(appointmentSlotID: number, patientID: number) {
    return await this.prismaService.$transaction(
      async (prisma) => {
        const appointmentSlot = await prisma.appointmentSlot.update({
          where: {
            id: appointmentSlotID,
          },
          data: {
            status: 'BOOKED',
          },
        });

        return await prisma.appointment.create({
          data: {
            patientID,
            doctorID: appointmentSlot.doctorID,
            appointmentSlotID: appointmentSlot.id,
            upcomingAppointmentApproveDate: subHours(
              appointmentSlot.appointmentDate,
              8,
            ),
            reservedAt: toZonedTime(new Date(), 'Europe/Istanbul'),
          },
          include: {
            AppointmentSlot: {
              include: {
                Doctor: {
                  include: {
                    Hospital: true,
                    Polyclinic: true,
                  },
                },
              },
            },
          },
        });
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }

  /**
   * Get Appointments by filter
   */
  async getAppointments(filter: GetAppointmentsQueryDto) {
    const {
      page,
      limit,
      city,
      district,
      startDate,
      endDate,
      doctorCode,
      hospitalCode,
    } = filter;

    const filterArgs: Prisma.DoctorWhereInput = {
      Hospital: {
        ...(city && { city }),
        ...(district && { district }),
        ...(hospitalCode && { hospitalCode }),
      },
      ...(doctorCode && { doctorCode }),
    };

    return await this.paginator.paginate(
      'Doctor',
      'findMany',
      {
        where: {
          ...filterArgs,
        },
        include: {
          Hospital: {
            select: { name: true, address: true, hospitalCode: true },
          },
          Polyclinic: { select: { name: true } },
          AppointmentSlot: {
            select: {
              appointmentDate: true,
              status: true,
              appointmentSlotCode: true,
            },
            where: {
              appointmentDate: {
                gte: new Date(startDate),
                lte: endOfDay(new Date(endDate)),
              },
            },
            orderBy: {
              appointmentDate: 'asc',
            },
          },
        },
      },
      {
        page,
        limit,
      },
    );
  }

  /**
   * İs appointment taken
   */
  async isAppointmentTaken(appointmentSlotCode: string, patientID: number) {
    return await this.prismaService.appointment.findFirst({
      where: {
        AppointmentSlot: {
          appointmentSlotCode,
        },
        appointmentStatus: {
          notIn: ['CANCELLED', 'COMPLETED'],
          in: ['SCHEDULED'],
        },
        patientID,
      },
      include: {
        AppointmentSlot: true,
      },
    });
  }

  /**
   * Cancel Appointment
   */
  async cancelAppointment(appointmentSlotCode: string, patientID: number) {
    return await this.prismaService.$transaction(async (prisma) => {
      const appointmentSlot = await prisma.appointmentSlot.update({
        where: {
          appointmentSlotCode,
        },
        data: {
          status: 'AVAILABLE',
        },
      });

      const scheduledAppointment = await prisma.appointment.findFirst({
        where: {
          appointmentSlotID: appointmentSlot.id,
          patientID,
          appointmentStatus: {
            in: ['SCHEDULED', 'APPROVED'],
          },
        },
      });

      return await prisma.appointment.update({
        where: {
          id: scheduledAppointment.id,
          patientID,
        },
        data: {
          appointmentStatus: 'CANCELLED',
          cancelledAt: toZonedTime(new Date(), 'Europe/Istanbul'),
        },
        include: {
          AppointmentSlot: {
            include: {
              Doctor: {
                include: {
                  Hospital: true,
                  Polyclinic: true,
                },
              },
            },
          },
        },
      });
    });
  }

  /**
   * Check User Other Appointments
   */
  async checkUserOtherAppointments(appointmentDate: Date, patientID: number) {
    return await this.prismaService.appointment.findFirst({
      where: {
        patientID,
        appointmentStatus: 'SCHEDULED',
        AppointmentSlot: {
          appointmentDate,
        },
      },
    });
  }

  /**
   * Approve Appointment
   */
  async approveAppointment(appointmentID: number, patientID: number) {
    return await this.prismaService.appointment.update({
      where: {
        id: appointmentID,
        patientID,
      },
      data: {
        appointmentStatus: 'APPROVED',
        appointmentApprovedAt: toZonedTime(new Date(), 'Europe/Istanbul'),
      },
    });
  }
}
