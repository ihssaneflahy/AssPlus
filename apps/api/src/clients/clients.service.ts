import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(agenceId: string) {
    return this.prisma.client.findMany({
      where: { agenceId },
      include: { contacts: true },
      orderBy: { nomComplet: 'asc' },
    });
  }

  async findOne(id: string, agenceId: string) {
    const client = await this.prisma.client.findFirst({
      where: { id, agenceId },
      include: { contacts: true, primes: { orderBy: { dateEmission: 'desc' }, take: 10 } },
    });
    if (!client) throw new NotFoundException('Client non trouvé');
    return client;
  }

  async create(dto: CreateClientDto, agenceId: string) {
    const { contacts, ...clientData } = dto;
    // Convert empty strings to undefined so Prisma stores NULL (avoids unique constraint collisions)
    const sanitized = {
      ...clientData,
      cin: clientData.cin || undefined,
      ice: clientData.ice || undefined,
      dateNaissance: clientData.dateNaissance || undefined,
    };
    try {
      return await this.prisma.client.create({
        data: { ...sanitized, agenceId, contacts: { create: contacts ?? [] } },
        include: { contacts: true },
      });
    } catch (e: any) {
      if (e.code === 'P2002') {
        const field = e.meta?.target?.includes('cin') ? 'CIN' : 'ICE';
        throw new ConflictException(`Un client avec ce ${field} existe déjà`);
      }
      throw e;
    }
  }

  async update(id: string, dto: Partial<CreateClientDto>, agenceId: string) {
    const client = await this.prisma.client.findFirst({ where: { id, agenceId } });
    if (!client) throw new NotFoundException('Client non trouvé');
    const { contacts, ...clientData } = dto;
    return this.prisma.client.update({
      where: { id },
      data: { ...clientData },
      include: { contacts: true },
    });
  }

  async search(query: string, agenceId: string) {
    return this.prisma.client.findMany({
      where: {
        agenceId,
        OR: [
          { nomComplet: { contains: query, mode: 'insensitive' } },
          { cin: { contains: query, mode: 'insensitive' } },
          { ice: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: { contacts: true },
      take: 20,
    });
  }
}
