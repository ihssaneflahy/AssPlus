import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateAgenceDto } from './dto/create-agence.dto';

@Injectable()
export class AgenceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.agence.findMany({
      include: { contacts: true, ribs: true, _count: { select: { users: true, clients: true } } },
    });
  }

  async findOne(id: string) {
    const agence = await this.prisma.agence.findUnique({
      where: { id },
      include: { contacts: true, ribs: true },
    });
    if (!agence) throw new NotFoundException('Agence non trouvée');
    return agence;
  }

  async create(dto: CreateAgenceDto) {
    const existing = await this.prisma.agence.findUnique({ where: { codeCompagnie: dto.codeCompagnie } });
    if (existing) throw new ConflictException('Code compagnie déjà utilisé');

    const { contacts, ribs, adminEmail, adminLogin, adminPassword, adminNomComplet, ...agenceData } = dto;
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    return this.prisma.agence.create({
      data: {
        ...agenceData,
        contacts: { create: contacts ?? [] },
        ribs: { create: ribs ?? [] },
        users: {
          create: {
            nomComplet: adminNomComplet,
            email: adminEmail,
            login: adminLogin,
            passwordHash,
            role: 'ADMIN_AGENCE',
          },
        },
      },
      include: { contacts: true, ribs: true, users: { select: { id: true, email: true, role: true } } },
    });
  }

  async toggleActif(id: string) {
    const agence = await this.prisma.agence.findUnique({ where: { id } });
    if (!agence) throw new NotFoundException('Agence non trouvée');
    return this.prisma.agence.update({ where: { id }, data: { actif: !agence.actif } });
  }
}
