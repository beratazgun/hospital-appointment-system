import { IsPasswordEqual } from '@backend/core/decorators/Is-password-equal.decorator';
import { IsPasswordStrong } from '@backend/core/decorators/Is-password-strong.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordBodyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'password',
    description: 'The old password',
  })
  oldPassword: string;

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
