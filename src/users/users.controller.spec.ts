import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('create', () => {
    it('deve criar um usuário com sucesso', async () => {
      const userData: CreateUserDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'securepassword',
      };

      const createdUserResponse = {
        message: 'User created successfully',
        userId: '1',
      };

      jest.spyOn(usersService, 'create').mockResolvedValue(createdUserResponse);

      const result = await usersController.create(userData);

      expect(result).toEqual(createdUserResponse);
      expect(usersService.create).toHaveBeenCalledWith(userData);
    });
  });
});
