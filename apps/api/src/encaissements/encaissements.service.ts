import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateEncaissementDto } from './dto/create-encaissement.dto';

@Injectable()
export class EncaissementsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(agenceId: string, clientId?: string) {
    return this.prisma.encaissement.findMany({
      where: { agenceId, ...(clientId ? { clientId } : {}) },
      include: {
        client: { select: { id: true, nomComplet: true } },
        details: true,
        lignesPrimes: { include: { prime: { select: { id: true, numeroPolice: true, montantTtc: true } } } },
        saisiPar: { select: { id: true, nomComplet: true } },
      },
      orderBy: { dateSaisie: 'desc' },
    });
  }

  async findOne(id: string, agenceId: string) {
    const enc = await this.prisma.encaissement.findFirst({
      where: { id, agenceId },
      include: { client: true, details: true, lignesPrimes: { include: { prime: true } }, saisiPar: true },
    });
    if (!enc) throw new NotFoundException('Encaissement non trouvé');
    return enc;
  }

  async create(dto: CreateEncaissementDto, agenceId: string, userId: string) {
    const { details, lignesPrimes, ...encData } = dto;

    const totalDetails = details.reduce((s, d) => s + d.montant, 0);
    if (Math.abs(totalDetails - encData.montantTotal) > 0.01) {
      throw new BadRequestException('Le total des détails ne correspond pas au montant total');
    }

    return this.prisma.encaissement.create({
      data: {
        ...encData,
        agenceId,
        saisiParId: userId,
        details: { create: details },
        lignesPrimes: {
          create: lignesPrimes?.map((l) => ({ primeId: l.primeId, montantAffecte: l.montantAffecte })) ?? [],
        },
      },
      include: { details: true, lignesPrimes: true },
    });
  }

  async valider(id: string, agenceId: string) {
    const enc = await this.prisma.encaissement.findFirst({ where: { id, agenceId } });
    if (!enc) throw new NotFoundException('Encaissement non trouvé');
    return this.prisma.encaissement.update({
      where: { id },
      data: { statut: 'VALIDE', dateStatut: new Date() },
    });
  }
}
