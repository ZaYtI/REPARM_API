import { Injectable } from '@nestjs/common';
import { CommandeService } from 'src/commande/commande.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import {
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { PanierItemService } from 'src/panier-item/panier-item.service';

@Injectable()
export class CommandeProduitService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly commandeService: CommandeService,
    private readonly userService: UserService,
    private readonly panierItemService: PanierItemService,
  ) {}

  async getProduitFromCommande(
    id_commande: number,
    req: Request & { user: any },
  ) {
    const commande = await this.commandeService.getCommandeById(id_commande);
    const user = await this.userService.findOneByEmail({
      email: req.user.email,
    });
    if (commande == null) {
      throw new NotFoundException('Commande not found');
    } else if (commande.userId != user.id) {
      throw new UnauthorizedException(
        "Vous ne possedez pas les droits ou vous n'etes pas proprietaire de cet commande",
      );
    } else {
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
  }

  async deleteProductFromCommande(
    id_commande: number,
    id_produit: number,
    req: Request & { user: any },
  ) {
    const commande = await this.commandeService.getCommandeById(id_commande);
    if (commande.payment == true) {
      throw new UnauthorizedException(
        'Le payment de la commande a déja était effectuer veuillez vous rapprochez du SAV pour retirer ce produit de votre commande ',
      );
    }
    const user = await this.userService.findOneByEmail(req.user.email);
    if (commande.userId != user.id) {
      throw new UnauthorizedException(
        "Vous ne possedez pas les droits ou vous n'etes pas proprietaire de cet commande",
      );
    }
    if (commande == null) {
      throw new NotFoundException('Commande not found');
    } else {
      return this.prismaService.commandeProduit.deleteMany({
        where: {
          commandeId: id_commande,
          produitId: id_produit,
        },
      });
    }
  }

  async createCommandeWithPanier(req: Request & { user: any }) {
    const panierItem =
      await this.panierItemService.getAllProductsFromPanierByUserId(
        req.user.sub,
      );
    if (panierItem.length != 0) {
      const commande = await this.commandeService.createCommande(req.user.sub);
      for (const product of panierItem) {
        await this.prismaService.commandeProduit.create({
          data: {
            produit: {
              connect: {
                id: product.id,
              },
            },
            quantity: product.quantity,
            commande: {
              connect: {
                id: commande.id,
              },
            },
          },
        });
      }
      await this.panierItemService.deleteAllProductsFromPanierByUserId(
        req.user.sub,
      );
      await this.panierItemService.updatePriceFromUserId(req.user.sub);
      return commande;
    } else {
      throw new NotFoundException('Panier is empty');
    }
  }
}
