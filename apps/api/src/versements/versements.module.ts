import { Module } from '@nestjs/common';
import { VersementsService } from './versements.service';
import { VersementsController } from './versements.controller';

@Module({ providers: [VersementsService], controllers: [VersementsController] })
export class VergementsModule {}
