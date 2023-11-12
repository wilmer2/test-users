import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from '../common/common.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [ConfigModule, CommonModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
