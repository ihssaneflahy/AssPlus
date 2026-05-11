import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByLogin(login: string) {
    return this.prisma.user.findUnique({ where: { login } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findAll(agenceId: string) {
    return this.prisma.user.findMany({
      where: { agenceId },
      select: { id: true, nomComplet: true, email: true, login: true, role: true, actif: true, derniereConnexion: true },
    });
  }

  async create(dto: CreateUserDto, agenceId: string) {
    const exists = await this.prisma.user.findFirst({
      where: { OR: [{ login: dto.login }, { email: dto.email }] },
    });
    if (exists) throw new ConflictException('Login ou email déjà utilisé');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    return this.prisma.user.create({
      data: { ...dto, password: undefined, passwordHash, agenceId },
      select: { id: true, nomComplet: true, email: true, login: true, role: true, actif: true },
    });
  }

  async updateLastLogin(id: string) {
    await this.prisma.user.update({
      where: { id },
      data: { derniereConnexion: new Date() },
    });
  }

  async deactivate(id: string, agenceId: string) {
    const user = await this.prisma.user.findFirst({ where: { id, agenceId } });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    return this.prisma.user.update({ where: { id }, data: { actif: false } });
  }
}
