import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VersementsService } from './versements.service';
import { CreateVersementDto } from './dto/create-versement.dto';
import { AgenceId, CurrentUser } from '../common/decorators/agence.decorator';

@ApiTags('Versements Banque')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('versements')
export class VersementsController {
  constructor(private readonly versementsService: VersementsService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les bordereaux de versement' })
  findAll(@AgenceId() agenceId: string) {
    return this.versementsService.findAll(agenceId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @AgenceId() agenceId: string) {
    return this.versementsService.findOne(id, agenceId);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un bordereau de versement' })
  create(@Body() dto: CreateVersementDto, @AgenceId() agenceId: string, @CurrentUser() user: any) {
    return this.versementsService.create(dto, agenceId, user.id);
  }

  @Post(':id/valider')
  @ApiOperation({ summary: 'Valider un bordereau' })
  valider(@Param('id') id: string, @AgenceId() agenceId: string) {
    return this.versementsService.valider(id, agenceId);
  }
}
