import {
  Body,
  Controller,
  Get,
  Next,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { NextFunction, Request, Response } from 'express';
import { AuthGuard } from '@backend/core/guards/auth.guard';
import { GetUserQuery } from './query/impl/get-user.impl';
import { GetUserAppointmentsQuery } from './query/impl/get-user-appointments.impl';
import { GetUserAppointmentsQueryDto } from './dtos/get-user-appointments.query.dto';
import { GetUserAppointmentDetailByIdQuery } from './query/impl/get-user-appointment-detail-by-id.impl';
import { Transform } from 'class-transformer';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Get Me
   */
  @UseGuards(AuthGuard)
  @Get('accunt/me')
  @ApiBearerAuth()
  getMe(@Req() req: Request) {
    return this.queryBus.execute(new GetUserQuery(req));
  }

  /**
   * Get User Appointments
   */
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('account/appointments')
  getUserAppointments(
    @Req() req: Request,
    @Query() status: GetUserAppointmentsQueryDto,
  ) {
    return this.queryBus.execute(new GetUserAppointmentsQuery(req, status));
  }

  /**
   * Get User Appointments
   */
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('account/appointments/:appointmentID')
  getUserAppointmentDetailByID(
    @Req() req: Request,
    @Param('appointmentID') appointmentSlotCode: string,
  ) {
    return this.queryBus.execute(
      new GetUserAppointmentDetailByIdQuery(appointmentSlotCode, req),
    );
  }
}
