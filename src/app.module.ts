import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { UserModule } from './users/user.module';
import { UsersRequestedModule } from './users-requested/users-requested.module';

@Module({
  imports: [CommonModule, UserModule, UsersRequestedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
