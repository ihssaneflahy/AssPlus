import { IsEnum, IsNotEmpty, IsOptional, IsString, IsDateString, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TypeClient, TypeContact } from '@assplus/database';

class ContactDto {
  @ApiProperty({ enum: TypeContact })
  @IsEnum(TypeContact)
  typeContact: TypeContact;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  valeur: string;
}

export class CreateClientDto {
  @ApiProperty({ enum: TypeClient })
  @IsEnum(TypeClient)
  typeClient: TypeClient;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cin?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ice?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nomComplet: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateNaissance?: string;

  @ApiPropertyOptional({ type: [ContactDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactDto)
  contacts?: ContactDto[];
}
