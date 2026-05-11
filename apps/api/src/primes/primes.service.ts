import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreatePrimeDto } from './dto/create-prime.dto';

@Injectable()
export class PrimesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(agenceId: string, clientId?: string) {
    return this.prisma.prime.findMany({
      where: { agenceId, ...(clientId ? { clientId } : {}) },
      include: { client: { select: { id: true, nomComplet: true } } },
      orderBy: { dateEmission: 'desc' },
    });
  }

  async findOne(id: string, agenceId: string) {
    const prime = await this.prisma.prime.findFirst({
      where: { id, agenceId },
      include: { client: true, lignesEncaissement: { include: { encaissement: true } } },
    });
    if (!prime) throw new NotFoundException('Prime non trouvée');
    return prime;
  }

  async create(dto: CreatePrimeDto, agenceId: string) {
    return this.prisma.prime.create({ data: { ...dto, agenceId } });
  }

  async annuler(id: string, agenceId: string) {
    const prime = await this.prisma.prime.findFirst({ where: { id, agenceId } });
    if (!prime) throw new NotFoundException('Prime non trouvée');
    return this.prisma.prime.update({
      where: { id },
      data: { statut: 'ANNULEE', dateStatut: new Date() },
    });
  }

  async getSoldeClient(clientId: string, agenceId: string) {
    const result = await this.prisma.prime.aggregate({
      where: { clientId, agenceId, statut: 'EMISE' },
      _sum: { montantTtc: true },
    });
    const encaisse = await this.prisma.ligneEncaissementPrime.aggregate({
      where: { prime: { clientId, agenceId } },
      _sum: { montantAffecte: true },
    });
    const totalDu = result._sum.montantTtc ?? 0;
    const totalEncaisse = encaisse._sum.montantAffecte ?? 0;
    return { totalDu, totalEncaisse, solde: Number(totalDu) - Number(totalEncaisse) };
  }
}
