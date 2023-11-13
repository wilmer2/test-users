import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from '../common/common.module';
import { UsersRequestedPublishService as UserPublish } from '../users-requested-publish/users-requested-publish.service';
import { mockUsers, mockUserService } from '../../__mock__';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, CommonModule],
      controllers: [UserController],
      providers: [UserService, UserPublish],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)

      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#getUsers()', () => {
    beforeEach(() => {
      userService.getUsers.mockClear();
      userService.getUsers.mockResolvedValue(mockUsers);
      userService.publish.mockClear();
    });

    it('Should call all its internal methods', async () => {
      await controller.getUsers();
      expect(userService.getUsers).toHaveBeenCalled();
      expect(userService.publish).toHaveBeenCalled();
    });

    it('Should call all its internal methods', async () => {
      await controller.getUsers();
      expect(userService.publish).toHaveBeenCalledWith(mockUsers);
    });
  });
});
