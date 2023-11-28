import { Module } from '@nestjs/common';
import { CommandeProduitService } from './commande-produit.service';
import { CommandeProduitController } from './commande-produit.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommandeModule } from 'src/commande/commande.module';
import { UserModule } from 'src/user/user.module';
import { PanierItemModule } from 'src/panier-item/panier-item.module';

@Module({
  imports: [PrismaModule, CommandeModule, UserModule, PanierItemModule],
  controllers: [CommandeProduitController],
  providers: [CommandeProduitService, PrismaService],
  exports: [CommandeProduitService],
})
export class CommandeProduitModule {}
