import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'The access token returned after successful login',
    example: 'token',
  })
  accessToken: string;
}
