import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'agent01' })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({ example: 'motdepasse123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
