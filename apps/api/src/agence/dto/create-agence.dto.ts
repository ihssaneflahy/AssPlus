import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TypeContact } from '@assplus/database';
import { IsEnum } from 'class-validator';

class ContactDto {
  @ApiProperty({ enum: TypeContact })
  @IsEnum(TypeContact)
  typeContact: TypeContact;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  valeur: string;
}

class RibDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  banque: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  rib: string;
}

export class CreateAgenceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  codeCompagnie: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  codeSecteur: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  responsable: string;

  @ApiPropertyOptional({ type: [ContactDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactDto)
  contacts?: ContactDto[];

  @ApiPropertyOptional({ type: [RibDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RibDto)
  ribs?: RibDto[];

  @ApiProperty({ description: 'Nom complet de l\'administrateur' })
  @IsString()
  @IsNotEmpty()
  adminNomComplet: string;

  @ApiProperty()
  @IsEmail()
  adminEmail: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  adminLogin: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  adminPassword: string;
}
