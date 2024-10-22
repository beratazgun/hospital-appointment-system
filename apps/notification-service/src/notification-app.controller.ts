import { Get, Controller, Render, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('template')
export class NotificationAppController {
  @Get('test')
  @Render('index')
  test(@Res() res: Response) {
    return { message: 'Hello world!' };
  }
}
