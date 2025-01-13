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
            findAll: jest.fn(),
            findOne: jest.fn(),
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

  describe('findAll', () => {
    it('deve retornar uma lista de usuários', async () => {
      const users = [
        {
          id: '1',
          name: 'John Doe',
          email: 'johndoe@example.com',
          createdAt: new Date(),
        },
        {
          id: '2',
          name: 'Jane Doe',
          email: 'janedoe@example.com',
          createdAt: new Date(),
        },
      ];

      jest.spyOn(usersService, 'findAll').mockResolvedValue(users);

      const result = await usersController.findAll();

      expect(result).toEqual(users);
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar um usuário pelo ID', async () => {
      const user = {
        id: '1',
        name: 'John Doe',
        email: 'johndoe@example.com',
        createdAt: new Date(),
      };

      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);

      const result = await usersController.findOne('1');

      expect(result).toEqual(user);
      expect(usersService.findOne).toHaveBeenCalledWith('1');
    });

    it('deve retornar null se o usuário não existir', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

      const result = await usersController.findOne('999');

      expect(result).toBeNull();
      expect(usersService.findOne).toHaveBeenCalledWith('999');
    });
  });
});
