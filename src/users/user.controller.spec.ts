import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from '../common/common.module';
import { usersMock } from '../../__mock__';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, CommonModule],
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useFactory: () => ({
            getUsers: jest.fn(),
            publishUsers: jest.fn(),
          }),
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#getUsers()', () => {
    beforeEach(() => {
      userService.getUsers.mockClear();
      userService.getUsers.mockResolvedValue(usersMock);
      userService.publishUsers.mockClear();
    });

    it('Should call all its internal methods', async () => {
      await controller.getUsers();
      expect(userService.getUsers).toHaveBeenCalled();
      expect(userService.publishUsers).toHaveBeenCalled();
    });

    it('Should call all its internal methods', async () => {
      await controller.getUsers();
      expect(userService.publishUsers).toHaveBeenCalledWith(usersMock);
    });
  });
});
