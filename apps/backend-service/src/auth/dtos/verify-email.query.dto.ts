import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class VerifyEmailQueryDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
