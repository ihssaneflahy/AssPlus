import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateVersementDto } from './dto/create-versement.dto';

@Injectable()
export class VersementsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(agenceId: string) {
    return this.prisma.versementBanque.findMany({
      where: { agenceId },
      include: { creePar: { select: { id: true, nomComplet: true } }, details: true },
      orderBy: { dateVersement: 'desc' },
    });
  }

  async findOne(id: string, agenceId: string) {
    const v = await this.prisma.versementBanque.findFirst({
      where: { id, agenceId },
      include: { details: { include: { encaissement: { include: { client: true } } } }, creePar: true },
    });
    if (!v) throw new NotFoundException('Versement non trouvé');
    return v;
  }

  async create(dto: CreateVersementDto, agenceId: string, userId: string) {
    return this.prisma.versementBanque.create({
      data: {
        ...dto,
        montantEspece: dto.montantEspece || undefined,
        agenceId,
        creeParId: userId,
      },
    });
  }

  async valider(id: string, agenceId: string) {
    const v = await this.prisma.versementBanque.findFirst({ where: { id, agenceId } });
    if (!v) throw new NotFoundException('Versement non trouvé');
    return this.prisma.versementBanque.update({
      where: { id },
      data: { statut: 'VALIDE', dateStatut: new Date() },
    });
  }
}
