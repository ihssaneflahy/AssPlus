import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PrimesService } from './primes.service';
import { CreatePrimeDto } from './dto/create-prime.dto';
import { AgenceId } from '../common/decorators/agence.decorator';

@ApiTags('Primes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('primes')
export class PrimesController {
  constructor(private readonly primesService: PrimesService) {}

  @Get()
  @ApiQuery({ name: 'clientId', required: false })
  @ApiOperation({ summary: 'Lister les primes' })
  findAll(@AgenceId() agenceId: string, @Query('clientId') clientId?: string) {
    return this.primesService.findAll(agenceId, clientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail prime' })
  findOne(@Param('id') id: string, @AgenceId() agenceId: string) {
    return this.primesService.findOne(id, agenceId);
  }

  @Post()
  @ApiOperation({ summary: 'Émettre une prime' })
  create(@Body() dto: CreatePrimeDto, @AgenceId() agenceId: string) {
    return this.primesService.create(dto, agenceId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Annuler une prime' })
  annuler(@Param('id') id: string, @AgenceId() agenceId: string) {
    return this.primesService.annuler(id, agenceId);
  }

  @Get('client/:clientId/solde')
  @ApiOperation({ summary: 'Solde client (primes vs encaissements)' })
  soldeClient(@Param('clientId') clientId: string, @AgenceId() agenceId: string) {
    return this.primesService.getSoldeClient(clientId, agenceId);
  }
}
