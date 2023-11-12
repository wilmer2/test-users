import { Test, TestingModule } from '@nestjs/testing';
import { UsersRequestedController } from './users-requested.controller';
import { UsersRequestedService } from './users-requested.service';

describe('UsersRequestedController', () => {
  let controller: UsersRequestedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersRequestedController],
      providers: [UsersRequestedService],
    }).compile();

    controller = module.get<UsersRequestedController>(UsersRequestedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
