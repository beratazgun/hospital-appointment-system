import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/modules/prisma/prisma.service';
import { Paginator } from '@backend/core/helpers/paginator';
import { GetUserAppointmentsQueryDto } from '../dtos/get-user-appointments.query.dto';

@Injectable()
export class UserRepository {
  constructor(
    private paginator: Paginator,
    private prismaService: PrismaService,
  ) {}

  /**
   * Get User Appointments By User Id
   */
  async getUserAppointmentsByUserID(
    userID: number,
    query: GetUserAppointmentsQueryDto,
  ) {
    const { limit, page, status } = query;

    return this.paginator.paginate(
      'Appointment',
      'findMany',
      {
        where: {
          patientID: userID,
          appointmentStatus: status,
        },
        include: {
          AppointmentSlot: {
            select: {
              appointmentDate: true,
            },
          },
          Doctor: {
            select: {
              fullName: true,
              Hospital: {
                select: {
                  name: true,
                  address: true,
                },
              },
              Polyclinic: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      { page, limit },
    );
  }

  /**
   * Find User's Appointment By Id
   */
  async isUserHaveAppointment(appointmentSlotCode: string, patientID: number) {
    return this.prismaService.appointment.findFirst({
      where: {
        patientID,
        AppointmentSlot: {
          appointmentSlotCode,
        },
        appointmentStatus: {
          in: ['APPROVED', 'SCHEDULED'],
        },
      },
    });
  }

  /**
   * Get User Appointment Detail By Id
   */
  async getUserAppointmentDetailByID(appointmentID: number, patientID: number) {
    return this.prismaService.appointment.findFirst({
      where: {
        id: appointmentID,
        patientID,
        appointmentStatus: {
          in: ['APPROVED', 'SCHEDULED'],
        },
      },
      include: {
        AppointmentSlot: true,
        Doctor: {
          select: {
            fullName: true,
            doctorCode: true,
            Hospital: true,
            Polyclinic: true,
          },
        },
      },
    });
  }
}
