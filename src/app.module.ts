import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { UserModule } from './users/user.module';
import { UsersRequestedModule } from './users-requested/users-requested.module';
import { EnvConfiguration } from './common/config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
    }),
    CommonModule,
    UserModule,
    UsersRequestedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
