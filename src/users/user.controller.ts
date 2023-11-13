import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './interfaces/user.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public async getUsers(): Promise<User[]> {
    const users = await this.userService.getUsers();

    await this.userService.publishUsersWithEvenId(users);

    return users;
  }
}
