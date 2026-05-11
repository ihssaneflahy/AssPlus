import { Controller, Get, Post, Body, Param, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { AgenceId } from '../common/decorators/agence.decorator';

@ApiTags('Clients')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les clients' })
  findAll(@AgenceId() agenceId: string) {
    return this.clientsService.findAll(agenceId);
  }

  @Get('search')
  @ApiQuery({ name: 'q', required: true })
  @ApiOperation({ summary: 'Rechercher un client' })
  search(@Query('q') query: string, @AgenceId() agenceId: string) {
    return this.clientsService.search(query, agenceId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail client' })
  findOne(@Param('id') id: string, @AgenceId() agenceId: string) {
    return this.clientsService.findOne(id, agenceId);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un client' })
  create(@Body() dto: CreateClientDto, @AgenceId() agenceId: string) {
    return this.clientsService.create(dto, agenceId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un client' })
  update(@Param('id') id: string, @Body() dto: CreateClientDto, @AgenceId() agenceId: string) {
    return this.clientsService.update(id, dto, agenceId);
  }
}
