import { Controller } from '@nestjs/common';
import { UsersRequestedService } from './users-requested.service';

@Controller()
export class UsersRequestedController {
  constructor(private readonly usersRequestedService: UsersRequestedService) {}
}
