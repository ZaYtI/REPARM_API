import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { CommandeProduitService } from './commande-produit.service';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RoleGuard } from 'src/auth/role/role.guard';
import { CommandeService } from 'src/commande/commande.service';
@Controller('commande-produit')
@ApiTags('commande-produit')
export class CommandeProduitController {
  constructor(
    private readonly commandeProduitService: CommandeProduitService,
    private readonly commandeService: CommandeService,
  ) {}

  @Get('get/:id')
  @UseGuards(RoleGuard)
  async getCommandeFromCommandeId(@Param('id') id: number) {
    return this.commandeProduitService.getProduitFromCommande(Number(id));
  }

  @Delete('delete/:id_commande/:id_produit')
  @Roles('user')
  @UseGuards(RoleGuard)
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
