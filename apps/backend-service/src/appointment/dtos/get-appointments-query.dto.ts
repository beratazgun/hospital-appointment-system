import { IsValidDateStringFormat } from '@backend/core/decorators/is-valid-date-string-format.decorator';
import { FilterDto } from '@backend/core/dtos/Filter.dto';
import { toZonedTime } from 'date-fns-tz';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  isDate,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  notEquals,
  NotEquals,
  Validate,
  ValidateIf,
} from 'class-validator';
import { addDays, startOfDay } from 'date-fns';

export class GetAppointmentsQueryDto extends FilterDto {
  @ApiProperty({
    required: false,
    type: String,
    description: '[year]-[month]-[day]',
    example: '2021-01-01',
  })
  @IsOptional()
  @NotEquals('', { message: 'startDate should not be empty' })
  @IsValidDateStringFormat()
  startDate?: string = new Date(
    startOfDay(toZonedTime(new Date(), 'Europe/Istanbul')),
  ).toISOString();

  @IsOptional()
  @ApiProperty({
    required: false,
    type: String,
    description: '[year]-[month]-[day]',
    example: '2021-12-31',
  })
  @NotEquals('', {
    message: 'endDate should not be empty',
  })
  @IsValidDateStringFormat()
  endDate?: string = addDays(
    startOfDay(toZonedTime(new Date(), 'Europe/Istanbul')),
    15,
  ).toISOString();

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'city name',
    example: 'erzurum',
  })
  @Transform(({ value }) => value.toLowerCase())
  city?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'district name',
    example: 'ispir',
    format: 'lowercase',
    pattern: '^[a-z]+$',
  })
  @Transform(({ value }) => value.toLowerCase())
  district?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    type: Number,
    description: 'doctor code',
    example: 123456,
  })
  @Transform(({ value }) => parseInt(value, 10))
  doctorCode?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'hospital code',
    example: 'SUNRISE_CLINIC',
    format: 'uppercase',
  })
  @Transform(({ value }) => value.toUpperCase())
  hospitalCode?: string;
}
