import { Module } from '@nestjs/common';
import { PrimesService } from './primes.service';
import { PrimesController } from './primes.controller';

@Module({ providers: [PrimesService], controllers: [PrimesController], exports: [PrimesService] })
export class PrimesModule {}
