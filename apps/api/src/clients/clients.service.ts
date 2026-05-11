import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.prisma.client.create({
      data: {
        ...clientData,
        agenceId,
        contacts: { create: contacts ?? [] },
      },
      include: { contacts: true },
    });
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
