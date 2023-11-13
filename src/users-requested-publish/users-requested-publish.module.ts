import { Module } from '@nestjs/common';
import { UsersRequestedPublishService } from './users-requested-publish.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [UsersRequestedPublishService],
  exports: [UsersRequestedPublishService],
})
export class UsersRequestedPublishModule {}
