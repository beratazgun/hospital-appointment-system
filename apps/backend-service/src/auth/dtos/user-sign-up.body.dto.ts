import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class UserSignupBodyDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsIn(Object.values(Gender), {
    message: 'Gender must be either MALE or FEMALE',
  })
  @IsNotEmpty()
  @ApiProperty()
  gender: 'MALE' | 'FEMALE';

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  birthDate: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  phone: string;
}
