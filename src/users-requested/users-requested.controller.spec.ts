import { Test, TestingModule } from '@nestjs/testing';
import { UsersRequestedController } from './users-requested.controller';
import { UsersRequestedService } from './users-requested.service';
import { CommonModule } from '../common/common.module';

describe('UsersRequestedController', () => {
  let controller: UsersRequestedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommonModule],
      controllers: [UsersRequestedController],
      providers: [UsersRequestedService],
    }).compile();

    controller = module.get<UsersRequestedController>(UsersRequestedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
