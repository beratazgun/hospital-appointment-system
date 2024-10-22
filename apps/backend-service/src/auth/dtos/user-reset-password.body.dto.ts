import { IsPasswordEqual } from '@backend/core/decorators/Is-password-equal.decorator';
import { IsPasswordStrong } from '@backend/core/decorators/Is-password-strong.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserResetPasswordBodyDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'example@example.com',
    description: 'The email address',
  })
  email: string;

  @ApiProperty({
    example: 123456,
    description: 'The OTP code',
  })
  @IsNumber()
  @IsNotEmpty()
  otpCode: number;

  @IsNotEmpty()
  @IsString()
  @IsPasswordStrong()
  @ApiProperty({
    example: 'password',
    description: 'The new password',
  })
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @IsPasswordEqual('newPassword')
  @ApiProperty({
    example: 'password',
    description: 'The new password confirmation',
  })
  newPasswordConfirmation: string;
}
