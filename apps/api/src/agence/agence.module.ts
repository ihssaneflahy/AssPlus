import { Module } from '@nestjs/common';
import { AgenceService } from './agence.service';
import { AgenceController } from './agence.controller';

@Module({ providers: [AgenceService], controllers: [AgenceController] })
export class AgenceModule {}
