import { Injectable } from '@nestjs/common';
import { CommandeService } from 'src/commande/commande.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import {
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { PanierItemService } from 'src/panier-item/panier-item.service';
import { RequestUserInterface } from 'src/auth/interface/requestUser.interface';

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
    }
    if (req.user.role != 'admin') {
      if (commande.userId != user.id) {
        throw new UnauthorizedException(
          "Vous ne possedez pas les droits ou vous n'etes pas proprietaire de cet commande",
        );
      }
    }
    return this.prismaService.commandeProduit.findMany({
      where: {
        commande: {
          id: id_commande,
        },
      },
      select: {
        produit: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
          },
        },
        quantity: true,
        commandeId: true,
      },
    });
  }

  async deleteProductFromCommande(
    id_commande: number,
    id_produit: number,
    req: Request & { user: RequestUserInterface },
  ) {
    const commande = await this.commandeService.getCommandeById(id_commande);
    if (commande == null) {
      throw new NotFoundException('Commande not found');
    }
    if (commande.payment == true) {
      throw new UnauthorizedException(
        'Le payment de la commande a déja était effectuer veuillez vous rapprochez du SAV pour retirer ce produit de votre commande ',
      );
    }
    const user = await this.userService.findOneByEmail({
      email: req.user.email,
    });
    if (commande.userId != user.id || req.user.role != 'admin') {
      throw new UnauthorizedException(
        "Vous n'êtes pas propriétaire de cette commande",
      );
    }
    await this.prismaService.commandeProduit.deleteMany({
      where: {
        commandeId: id_commande,
        produitId: id_produit,
      },
    });
    const productCommande = await this.getProduitFromCommande(id_commande, req);
    if (productCommande.length == 0) {
      await this.commandeService.deleteCommande(id_commande);
      return {
        message: 'Commande deleted',
        data: 'Il n y a plus de produit dans cette commande',
      };
    } else {
      return {
        message: 'Product deleted from commande',
        data: productCommande,
      };
    }
  }

  async deleteCommandeFromCommandeId(id_commande: number) {
    const commande = await this.commandeService.getCommandeById(id_commande);
    if (commande == null) {
      throw new NotFoundException('Commande not found');
    }
    if (commande.payment == true) {
      throw new UnauthorizedException(
        'Le payment de la commande a déja était effectuer veuillez vous rapprochez du SAV pour retirer ce produit de votre commande ',
      );
    }
    await this.prismaService.commandeProduit.deleteMany({
      where: {
        commandeId: id_commande,
      },
    });
    return {
      message: 'commande succesfully deleted',
    };
  }

  async createCommandeWithPanier(
    req: Request & { user: RequestUserInterface },
  ) {
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
                id: product.produit.id,
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
      return {
        message: 'Commande created',
        commande: commande,
        data: await this.getProduitFromCommande(commande.id, req),
      };
    } else {
      throw new NotFoundException('Panier is empty');
    }
  }
}
