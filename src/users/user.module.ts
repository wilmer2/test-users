import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from '../common/common.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UsersRequestedPublishModule } from '../users-requested-publish/users-requested-publish.module';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    CommonModule,
    UsersRequestedPublishModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
