import { Module } from '@nestjs/common';
import { UsersRequestedService } from './users-requested.service';
import { UsersRequestedController } from './users-requested.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [UsersRequestedController],
  providers: [UsersRequestedService],
})
export class UsersRequestedModule {}
