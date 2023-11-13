import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UsersRequestedPublishService } from '../users-requested-publish/users-requested-publish.service';
import { User } from './interfaces/user.interface';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userPublishService: UsersRequestedPublishService,
  ) {}

  @Get()
  public async getUsers(): Promise<User[]> {
    const users = await this.userService.getUsers();

    await this.userPublishService.publishUsers(users);

    return users;
  }
}
