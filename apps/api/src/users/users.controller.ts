import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AgenceId } from '../common/decorators/agence.decorator';

@ApiTags('Utilisateurs')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les utilisateurs de l\'agence' })
  findAll(@AgenceId() agenceId: string) {
    return this.usersService.findAll(agenceId);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un utilisateur' })
  create(@Body() dto: CreateUserDto, @AgenceId() agenceId: string) {
    return this.usersService.create(dto, agenceId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Désactiver un utilisateur' })
  deactivate(@Param('id') id: string, @AgenceId() agenceId: string) {
    return this.usersService.deactivate(id, agenceId);
  }
}
