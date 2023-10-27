import { Module } from '@nestjs/common';
import { CommandeProduitService } from './commande-produit.service';
import { CommandeProduitController } from './commande-produit.controller';
import { CommandeModule } from 'src/commande/commande.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, CommandeModule],
  controllers: [CommandeProduitController],
  providers: [CommandeProduitService],
})
export class CommandeProduitModule {}
