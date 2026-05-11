import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleUser } from '@assplus/database';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nomComplet: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ enum: RoleUser, default: RoleUser.GESTIONNAIRE })
  @IsEnum(RoleUser)
  role: RoleUser = RoleUser.GESTIONNAIRE;
}
