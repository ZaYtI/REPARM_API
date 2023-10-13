import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service'; // Assurez-vous d'utiliser le bon chemin vers PrismaService

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Assurez-vous que PrismaService est exporté ici
})
export class PrismaModule {}
