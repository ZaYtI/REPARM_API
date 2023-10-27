import { Injectable } from '@nestjs/common';
import { CommandeService } from 'src/commande/commande.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommandeProduitService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly commandeService: CommandeService,
  ) {}

  async getProduitFromCommande(id_commande: number) {
    return this.prismaService.commandeProduit.findMany({
      where: {
        commande: {
          id: id_commande,
        },
      },
      select: {
        produit: true,
        quantity: true,
        commandeId: true,
      },
    });
  }

  async deleteProductFromCommande(id_commande: number, id_produit: number) {
    const commande = this.commandeService.getCommandeById(id_commande);
    if ((await commande).isValidate == true) {
      return null;
    }
    if (commande == null) {
      return null;
    } else {
      return this.prismaService.commandeProduit.deleteMany({
        where: {
          commandeId: id_commande,
          produitId: id_produit,
        },
      });
    }
  }

  async getCommandeProduitFromUserId(id_user: number) {
    return this.prismaService.commandeProduit.findMany({
      where: {
        commande: {
          userId: id_user,
        },
      },
    });
  }
}
