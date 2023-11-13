import { Test, TestingModule } from '@nestjs/testing';
import { UsersRequestedService } from './users-requested.service';
import { CommonModule } from '../common/common.module';

describe('UsersRequestedService', () => {
  let service: UsersRequestedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommonModule],
      providers: [UsersRequestedService],
    }).compile();

    service = module.get<UsersRequestedService>(UsersRequestedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
