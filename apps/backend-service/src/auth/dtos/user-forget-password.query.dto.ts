import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserForgetPasswordQueryDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    format: 'email',
    example: 'example@example.com',
  })
  email: string;
}
