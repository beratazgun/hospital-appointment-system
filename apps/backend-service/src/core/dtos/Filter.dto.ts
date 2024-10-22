import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber, Min, ValidateIf } from 'class-validator';

function toNumber(value: string, defaultValue: number): number {
  const numberValue = parseInt(value);
  return isNaN(numberValue) ? defaultValue : numberValue;
}

export class FilterDto {
  @IsNumber()
  @ValidateIf((o) => o.page !== undefined)
  @ApiProperty({
    required: false,
    type: String,
    description: 'page number',
    example: 1,
    default: 1,
  })
  @Transform(({ value }) => toNumber(value, 1))
  @Min(1)
  @Type(() => Number)
  public page: number = 1;

  @IsNumber()
  @ValidateIf((o) => o.limit !== undefined)
  @ApiProperty({
    required: false,
    type: String,
    description: 'Per page limit',
    example: 50,
    default: 500,
  })
  @Transform(({ value }) => toNumber(value, 500))
  @Min(1)
  @Type(() => Number)
  public limit: number = 500;
}
