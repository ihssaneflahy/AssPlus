import { IsEnum, IsNotEmpty, IsOptional, IsString, IsDateString, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TypeEmission } from '@assplus/database';

export class CreatePrimeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  numeroPolice?: string;

  @ApiProperty()
  @IsDateString()
  dateEmission: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateEffet?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateEcheance?: string;

  @ApiProperty({ enum: TypeEmission })
  @IsEnum(TypeEmission)
  typeEmission: TypeEmission;

  @ApiPropertyOptional()
  @IsOptional()
  resumeVente?: object;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  montantTtc: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  montantNet: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  commissionBrute: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  commissionNet: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clientId: string;
}
