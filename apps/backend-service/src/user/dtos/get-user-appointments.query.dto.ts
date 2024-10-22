import { FilterDto } from '@backend/core/dtos/Filter.dto';
import { AppointmentStatus } from '@prisma/client';
import { IsIn, IsNotEmpty } from 'class-validator';

export class GetUserAppointmentsQueryDto extends FilterDto {
  @IsNotEmpty()
  @IsIn(Object.values(AppointmentStatus))
  status: AppointmentStatus;
}
