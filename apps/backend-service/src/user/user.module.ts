import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { UserQueryHandlers } from './query/handler';
import { UserRepository } from './repository/user.repository';
import { Paginator } from '@backend/core/helpers/paginator';

@Module({
  imports: [CqrsModule],
  providers: [UserRepository, Paginator, ...UserQueryHandlers],
  controllers: [UserController],
})
export class UserModule {}
