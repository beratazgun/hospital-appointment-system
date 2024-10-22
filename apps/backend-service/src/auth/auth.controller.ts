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
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  UserSigninBodyDto,
  UserSignupBodyDto,
  UserForgetPasswordQueryDto,
  VerifyEmailQueryDto,
  UpdatePasswordBodyDto,
  UserResetPasswordBodyDto,
} from './dtos';
import { UserSignUpCommand } from './command/impl/user-sign-up.impl';
import { Request, Response } from 'express';
import { AuthGuard } from '@backend/core/guards/auth.guard';
import { VerifyEmailCommand } from './command/impl/verify-email.impl';
import { UserSignInCommand } from './command/impl/user-sign-in.impl';
import { HttpResponse } from '@common/helpers/http-response';
import { UserForgetPasswordCommand } from './command/impl/user-forget-password.impl';
import { UserUpdatePasswordCommand } from './command/impl/user-update-password.impl';
import { UserResetPasswordCommand } from './command/impl/user-reset-password.impl';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * User signup
   */
  @Post('signup')
  async userSignup(@Body() body: UserSignupBodyDto) {
    return this.commandBus.execute(new UserSignUpCommand(body));
  }

  /**
   * Verify email
   */
  @Post('verify-email/:otpCode')
  verifyEmail(
    @Param('otpCode') otpCode: string,
    @Query() query: VerifyEmailQueryDto,
  ) {
    return this.commandBus.execute(
      new VerifyEmailCommand(Number(otpCode), query.email),
    );
  }

  /**
   * Signin user
   */
  @Post('signin')
  signin(@Body() body: UserSigninBodyDto, @Req() req: Request) {
    return this.commandBus.execute(new UserSignInCommand(body, req));
  }

  /**
   * Signout
   */
  @UseGuards(AuthGuard)
  @Post('signout')
  @ApiBearerAuth()
  signout(@Req() req: Request, @Res() res: Response) {
    try {
      req.session.destroy((err) => {
        return err;
      });
    } catch (error) {
      return new BadRequestException('Logout failed');
    }

    return new HttpResponse(200, {
      message: 'Signout successfully',
    });
  }

  /**
   * User Forgot Password
   */
  @Post('forgot-password')
  userForgetPassword(@Query() query: UserForgetPasswordQueryDto) {
    return this.commandBus.execute(new UserForgetPasswordCommand(query));
  }

  /**
   * User Reset Password.
   *
   * This should trigger after forgot password
   */
  @Post('reset-password')
  userResetPassword(@Body() body: UserResetPasswordBodyDto) {
    return this.commandBus.execute(new UserResetPasswordCommand(body));
  }

  /**
   * Update Password
   */
  @UseGuards(AuthGuard)
  @Post('update-password')
  @ApiBearerAuth()
  userUpdatePassword(@Body() body: UpdatePasswordBodyDto, @Req() req: Request) {
    return this.commandBus.execute(new UserUpdatePasswordCommand(body, req));
  }
}
