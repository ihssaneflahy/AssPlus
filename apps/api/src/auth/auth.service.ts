import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser(login: string, password: string) {
    const user = await this.usersService.findByLogin(login);
    if (!user || !user.actif) throw new UnauthorizedException('Identifiants invalides');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Identifiants invalides');
    return user;
  }

  async login(user: { id: string; login: string; role: string; agenceId: string | null }) {
    const payload = { sub: user.id, login: user.login, role: user.role, agenceId: user.agenceId };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt },
    });

    return { accessToken, refreshToken };
  }

  async refresh(token: string) {
    const stored = await this.prisma.refreshToken.findUnique({ where: { token } });
    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Token expiré ou invalide');
    }
    const user = await this.usersService.findById(stored.userId);
    if (!user || !user.actif) throw new UnauthorizedException();

    await this.prisma.refreshToken.delete({ where: { token } });
    return this.login(user);
  }

  async logout(token: string) {
    await this.prisma.refreshToken.deleteMany({ where: { token } });
  }
}
