import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiHeaders, ApiParam, ApiTags } from '@nestjs/swagger';
import { GetAppointmentsQueryDto } from './dtos/get-appointments-query.dto';
import { GetAppointmentsQuery } from './query/impl/get-appointments.impl';
import { AuthGuard } from '@backend/core/guards/auth.guard';
import { CreateAppointmentCommand } from './command/impl/create-appointment.impl';
import { CancelAppointmentCommand } from './command/impl/cancel-appointment.impl';
import { ApproveAppointmentCommand } from './command/impl/approve-appointment.impl';

@ApiTags('appointment')
@Controller('appointment')
export class AppointmentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Get filtered appointments
   */
  @Get('get')
  getFilteredAppointments(@Query() query: GetAppointmentsQueryDto) {
    return this.queryBus.execute(new GetAppointmentsQuery(query));
  }

  /**
   * Create appointment
   */
  @UseGuards(AuthGuard)
  @ApiHeaders([
    {
      name: 'Authorization',
      description: 'Bearer token',
      required: true,
    },
  ])
  @ApiParam({
    name: 'appointmentSlotCode',
    description: 'Appointment',
    required: true,
    type: 'string',
  })
  @Post('create/:appointmentSlotCode')
  createAppointment(
    @Param('appointmentSlotCode') appointmentSlotCode: string,
    @Req() req: Request,
  ) {
    return this.commandBus.execute(
      new CreateAppointmentCommand(appointmentSlotCode, req),
    );
  }

  /**
   * Cancel appointment
   */
  @UseGuards(AuthGuard)
  @ApiHeaders([
    {
      name: 'Authorization',
      description: 'Bearer token',
      required: true,
    },
  ])
  @ApiParam({
    name: 'appointmentSlotCode',
    description: 'Appointment',
    required: true,
    type: 'string',
  })
  @Post('cancel/:appointmentSlotCode')
  cancelAppointment(
    @Param('appointmentSlotCode') appointmentSlotCode: string,
    @Req() req: Request,
  ) {
    return this.commandBus.execute(
      new CancelAppointmentCommand(appointmentSlotCode, req),
    );
  }

  /**
   * Approve appointment
   */
  @ApiParam({
    name: 'appointmentSlotCode',
    description: 'Appointment',
    required: true,
    type: 'string',
  })
  @UseGuards(AuthGuard)
  @Post('approve/:appointmentSlotCode')
  approveAppointment(
    @Param('appointmentSlotCode') appointmentSlotCode: string,
    @Req() req: Request,
  ) {
    return this.commandBus.execute(
      new ApproveAppointmentCommand(appointmentSlotCode, req),
    );
  }
}
