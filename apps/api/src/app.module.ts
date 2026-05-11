import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AgenceModule } from './agence/agence.module';
import { ClientsModule } from './clients/clients.module';
import { PrimesModule } from './primes/primes.module';
import { EncaissementsModule } from './encaissements/encaissements.module';
import { VergementsModule } from './versements/versements.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    AgenceModule,
    ClientsModule,
    PrimesModule,
    EncaissementsModule,
    VergementsModule,
  ],
})
export class AppModule {}
