import { Controller, Get, Param, Delete } from '@nestjs/common';
import { CommandeProduitService } from './commande-produit.service';
import { CommandeService } from 'src/commande/commande.service';

@Controller('commande-produit')
export class CommandeProduitController {
  constructor(
    private readonly commandeProduitService: CommandeProduitService,
    private readonly commandeService: CommandeService,
  ) {}

  @Get('get/:id')
  async getCommandeFromCommandeId(@Param('id') id: number) {
    return this.commandeProduitService.getProduitFromCommande(Number(id));
  }

  @Delete('delete/:id_commande/:id_produit')
  async deleteProductFromCommande(
    @Param('id_commande') id_commande: number,
    @Param('id_produit') id_produit: number,
  ) {
    return this.commandeProduitService.deleteProductFromCommande(
      Number(id_commande),
      Number(id_produit),
    );
  }
}
