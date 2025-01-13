import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserSchema } from './schemas/create-user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createUserSchema)) createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
