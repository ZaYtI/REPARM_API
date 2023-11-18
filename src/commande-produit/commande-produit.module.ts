import { Module } from '@nestjs/common';
import { CommandeProduitService } from './commande-produit.service';
import { CommandeProduitController } from './commande-produit.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommandeModule } from 'src/commande/commande.module';

@Module({
  imports: [PrismaModule, CommandeModule],
  controllers: [CommandeProduitController],
  providers: [CommandeProduitService, PrismaService],
  exports: [CommandeProduitService],
})
export class CommandeProduitModule {}
