import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EncaissementsService } from './encaissements.service';
import { CreateEncaissementDto } from './dto/create-encaissement.dto';
import { AgenceId, CurrentUser } from '../common/decorators/agence.decorator';

@ApiTags('Encaissements')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('encaissements')
export class EncaissementsController {
  constructor(private readonly encaissementsService: EncaissementsService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les encaissements' })
  findAll(@AgenceId() agenceId: string, @Query('clientId') clientId?: string) {
    return this.encaissementsService.findAll(agenceId, clientId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @AgenceId() agenceId: string) {
    return this.encaissementsService.findOne(id, agenceId);
  }

  @Post()
  @ApiOperation({ summary: 'Saisir un encaissement' })
  create(@Body() dto: CreateEncaissementDto, @AgenceId() agenceId: string, @CurrentUser() user: any) {
    return this.encaissementsService.create(dto, agenceId, user.id);
  }

  @Post(':id/valider')
  @ApiOperation({ summary: 'Valider un encaissement' })
  valider(@Param('id') id: string, @AgenceId() agenceId: string) {
    return this.encaissementsService.valider(id, agenceId);
  }
}
