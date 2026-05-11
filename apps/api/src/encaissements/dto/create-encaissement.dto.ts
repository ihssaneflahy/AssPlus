import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TypeDetailEncaissement } from '@assplus/database';

class CreateDetailDto {
  @ApiProperty({ enum: TypeDetailEncaissement })
  @IsEnum(TypeDetailEncaissement)
  type: TypeDetailEncaissement;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  montant: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  numCheque?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dateVersement?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  numVirement?: string;
}

class LignePrimeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  primeId: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  montantAffecte: number;
}

export class CreateEncaissementDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  montantTotal: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({ type: [CreateDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetailDto)
  details: CreateDetailDto[];

  @ApiPropertyOptional({ type: [LignePrimeDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LignePrimeDto)
  lignesPrimes?: LignePrimeDto[];
}
