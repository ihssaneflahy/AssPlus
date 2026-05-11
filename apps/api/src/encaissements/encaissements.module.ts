import { Module } from '@nestjs/common';
import { EncaissementsService } from './encaissements.service';
import { EncaissementsController } from './encaissements.controller';

@Module({ providers: [EncaissementsService], controllers: [EncaissementsController] })
export class EncaissementsModule {}
