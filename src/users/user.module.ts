import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from '../common/common.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UsersRequestedPublishModule } from '../users-requested-publish/users-requested-publish.module';

@Module({
  imports: [ConfigModule, CommonModule, UsersRequestedPublishModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
