import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthCommandHandlers } from './command/handler';
import { AuthEventHandlers } from './event/handler';
import { AuthRepository } from './repository/auth.repository';

@Module({
  imports: [CqrsModule],
  providers: [AuthRepository, ...AuthCommandHandlers, ...AuthEventHandlers],
  controllers: [AuthController],
})
export class AuthModule {}
