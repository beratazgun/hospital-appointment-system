import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAppointmentSlotCommand } from '@backend/jobs/command/impl/create-appointment-slot.impl';
import { PrismaService } from '@common';
import { JobsRepository } from '@backend/jobs/repository/jobs.repository';
import {
  addDays,
  addMinutes,
  format,
  isAfter,
  isBefore,
  parse,
  startOfDay,
} from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
@CommandHandler(CreateAppointmentSlotCommand)
export class CreateAppointmentSlotHandler
  implements ICommandHandler<CreateAppointmentSlotCommand>
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jobsRepository: JobsRepository,
  ) {}

  async execute(command: CreateAppointmentSlotCommand) {
    const appointmentSlots = this.generateTimeSlots();

    const doctors = await this.prismaService.doctor.findMany({
      include: {
        AppointmentSlot: true,
      },
    });

    let availableAppointments = [];

    for (const doctor of doctors) {
      const doctorAppointments = appointmentSlots.flatMap((chunks) => {
        return chunks
          .map((el) => {
            const appointmentSlotCode = this.generateAppointmentID(
              el,
              doctor.id,
            );

            if (
              !doctor.AppointmentSlot.some(
                (slot) => slot.appointmentSlotCode === appointmentSlotCode,
              )
            ) {
              return {
                appointmentSlotCode,
                appointmentDate: el,
                doctorID: doctor.id,
              };
            }

            return null;
          })
          .filter(Boolean);
      });

      availableAppointments.push(...doctorAppointments);
    }

    await this.jobsRepository.createAvailableAppointmentSlots(
      availableAppointments,
    );
  }

  /**
   * Generate time slots between start and end time
   */
  private generateTimeSlots() {
    const availableSlots: Date[][] = [];
    let timeSlots: Date[] = [];

    let currenDate = startOfDay(toZonedTime(new Date(), 'Europe/Istanbul'));
    const endDate = startOfDay(addDays(currenDate, 16));

    while (isBefore(currenDate, endDate)) {
      const startTime = parse('09:00', 'HH:mm', currenDate);
      const endTime = parse('17:00', 'HH:mm', currenDate);
      let currentTime = startTime;

      const breakStartTime = parse('12:00', 'HH:mm', currenDate);
      const breakEndTime = parse('13:00', 'HH:mm', currenDate);

      while (isBefore(currentTime, endTime)) {
        if (
          isBefore(currentTime, breakStartTime) ||
          isAfter(currentTime, breakEndTime)
        ) {
          timeSlots.push(currentTime);
        }

        currentTime = addMinutes(currentTime, 15);
      }

      availableSlots.push(timeSlots);
      currenDate = addDays(currenDate, 1);
      timeSlots = [];
    }

    return availableSlots;
  }

  /**
   *
   */
  private generateAppointmentID(appointmentDate: Date, doctorID: number) {
    const formattedDate = format(appointmentDate, 'ddHHyyyyhhmm');

    return `AI${formattedDate}-${doctorID}`;
  }
}
