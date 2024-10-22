import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AppointmentCommandHandlers } from './command/handler';
import { AppointmentRepository } from './repository/appointment.repository';
import { AppointmentEventHandlers } from './event/handler';
import { AppointmentQueryHandlers } from './query/handler';
import { Paginator } from '@backend/core/helpers/paginator';

@Module({
  imports: [CqrsModule],
  providers: [
    AppointmentRepository,
    Paginator,
    ...AppointmentCommandHandlers,
    ...AppointmentEventHandlers,
    ...AppointmentQueryHandlers,
  ],
  controllers: [AppointmentController],
})
export class AppointmentModule {}
