import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

export type LoginDtoType = z.infer<typeof loginSchema>;

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'johndoe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'pass123',
  })
  password: string;
}
