import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { UserModule } from './users/user.module';
import { UsersRequestedModule } from './users-requested-consumer/users-requested.module';
import { EnvConfiguration } from './common/config/env.config';
import { UsersRequestedPublishModule } from './users-requested-publish/users-requested-publish.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
    }),
    CommonModule,
    UserModule,
    UsersRequestedModule,
    UsersRequestedPublishModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
