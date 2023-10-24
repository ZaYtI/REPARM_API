import { Module } from '@nestjs/common';
import { CommandeProduitService } from './commande-produit.service';
import { CommandeProduitController } from './commande-produit.controller';

@Module({
  controllers: [CommandeProduitController],
  providers: [CommandeProduitService],
})
export class CommandeProduitModule {}
