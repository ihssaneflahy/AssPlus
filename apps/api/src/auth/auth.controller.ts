import { Controller, Post, Body, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: 'Connexion utilisateur' })
  async login(@Req() req: any, @Body() _dto: LoginDto) {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rafraîchir le token d\'accès' })
  async refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Déconnexion' })
  async logout(@Body() dto: RefreshDto) {
    await this.authService.logout(dto.refreshToken);
  }
}
