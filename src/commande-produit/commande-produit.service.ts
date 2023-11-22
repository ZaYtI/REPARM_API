import { Injectable } from '@nestjs/common';
import { CommandeService } from 'src/commande/commande.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import {
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common/exceptions';

@Injectable()
export class CommandeProduitService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly commandeService: CommandeService,
    private readonly userService: UserService,
  ) {}

  async getProduitFromCommande(
    id_commande: number,
    req: Request & { user: any },
  ) {
    const commande = await this.commandeService.getCommandeById(id_commande);
    const user = await this.userService.findOneByEmail(req.user.email);
    if (commande == null) {
      throw new NotFoundException('Commande not found');
    } else if (commande.userId != user.id && req.user.role != 'admin') {
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
      return null;
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
}
