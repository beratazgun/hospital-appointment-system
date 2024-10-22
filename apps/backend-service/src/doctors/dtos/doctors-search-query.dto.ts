import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DoctorsSearchQueryDto {
  /**
   * The search query
   */
  @IsString()
  @ApiProperty({
    description: 'The search query',
    example: 'John Doe',
  })
  readonly search: string;
}
