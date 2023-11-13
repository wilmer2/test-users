import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from '../common/common.module';
import { UsersRequestedPublishService as UserPublish } from '../users-requested-publish/users-requested-publish.service';
import { mockUsers } from '../../__mock__';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;
  let userPublishService: jest.Mocked<UserPublish>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, CommonModule],
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useFactory: () => ({
            getUsers: jest.fn(),
          }),
        },
        {
          provide: UserPublish,
          useFactory: () => ({
            publishUsers: jest.fn(),
          }),
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get(UserService);
    userPublishService = module.get(UserPublish);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#getUsers()', () => {
    beforeEach(() => {
      userService.getUsers.mockClear();
      userService.getUsers.mockResolvedValue(mockUsers);
      userPublishService.publishUsers.mockClear();
    });

    it('Should call all its internal methods', async () => {
      await controller.getUsers();
      expect(userService.getUsers).toHaveBeenCalled();
      expect(userPublishService.publishUsers).toHaveBeenCalled();
    });

    it('Should call all its internal methods', async () => {
      await controller.getUsers();
      expect(userPublishService.publishUsers).toHaveBeenCalledWith(mockUsers);
    });
  });
});
