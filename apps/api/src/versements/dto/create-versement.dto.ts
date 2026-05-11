import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVersementDto {
  @ApiProperty()
  @IsDateString()
  dateVersement: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nomBanque: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  compteBanque: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  montantTotal: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  montantEspece?: number;
}
