import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { LoginDto, loginSchema } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body(new ZodValidationPipe(loginSchema)) loginDto: LoginDto,
  ): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }
}
