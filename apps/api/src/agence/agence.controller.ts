import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AgenceService } from './agence.service';
import { CreateAgenceDto } from './dto/create-agence.dto';

// Ce controller est réservé au SUPER_ADMIN (console d'administration)
@ApiTags('Administration - Agences')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('admin/agences')
export class AgenceController {
  constructor(private readonly agenceService: AgenceService) {}

  @Get()
  @ApiOperation({ summary: '[SUPER_ADMIN] Lister toutes les agences' })
  findAll() {
    return this.agenceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agenceService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '[SUPER_ADMIN] Créer une agence + admin' })
  create(@Body() dto: CreateAgenceDto) {
    return this.agenceService.create(dto);
  }

  @Patch(':id/toggle-actif')
  @ApiOperation({ summary: '[SUPER_ADMIN] Activer/désactiver une agence' })
  toggleActif(@Param('id') id: string) {
    return this.agenceService.toggleActif(id);
  }
}
