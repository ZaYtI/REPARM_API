import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommandeInterface } from './interface/commande.interface';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ProductService } from 'src/product/product.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class CommandeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly mailService: MailService,
  ) {}

  async createCommande(userId: number): Promise<any | null> {
    return this.prismaService.commande.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        shippingMethod: 'test',
        trackingUrl: 'test',
        shippingAddress: 'test',
      },
    });
  }

  async getCommandeById(commandeId: number): Promise<CommandeInterface> {
    const commande = await this.prismaService.commande.findUnique({
      where: {
        id: commandeId,
      },
    });
    return {
      id: commande.id,
      userId: commande.userId,
      payment: commande.payment,
      createdAt: commande.createdAt,
      updatedAt: commande.updatedAt,
    };
  }

  async deleteCommande(commandeId: number): Promise<any | null> {
    return this.prismaService.commande.delete({
      where: {
        id: commandeId,
      },
    });
  }

  async getCommandeByUserId(userId: number): Promise<CommandeInterface[]> {
    const commandes = await this.prismaService.commande.findMany({
      where: {
        user: {
          id: userId,
        },
      },
    });
    return commandes.map((commande) => ({
      id: commande.id,
      userId: commande.userId,
      payment: commande.payment,
      createdAt: commande.createdAt,
      updatedAt: commande.updatedAt,
    }));
  }

  async updateValidationCommande(
    commandeId: number,
    userId: number,
  ): Promise<any | null> {
    return this.prismaService.commande.update({
      where: {
        id: commandeId,
        user: {
          id: userId,
        },
      },
      data: {
        payment: true,
      },
    });
  }

  async createCommandeFromNaturabuy(naturabuyResponse: any): Promise<any[]> {
    const commandes = [];
    for (const orders of naturabuyResponse) {
      console.log(orders.buyer.email);
      let user = await this.userService.findOneByEmail({
        email: orders.buyer.email,
      });
      if (!user) {
        const formattedBirthDate = new Date(orders.buyer.birthdate);
        const password = await this.userService.generateRandomPassword();
        const createUserDto: CreateUserDto = {
          postalCode: '',
          nick: orders.buyer.nick,
          civility: orders.buyer.civilite,
          firstName: orders.buyer.firstName,
          lastName: orders.buyer.lastName,
          birthDate: formattedBirthDate,
          address: orders.buyer.address,
          city: orders.buyer.city,
          country: orders.buyer.country,
          phone: orders.buyer.phone,
          email: orders.buyer.email,
          password: password,
          avatar: null,
        };
        user = await this.userService.createUser(createUserDto);
        await this.mailService.sendUserPasswordFromNaturaBuyOrder(
          orders.buyer.email,
          password,
        );
      }
      let shippingAddress: string;
      if (orders.shipping.shipping_address != null) {
        shippingAddress = orders.shipping.shipping_address.address;
      } else {
        shippingAddress = orders.shipping.relay_point_address.address1;
      }
      const trackingUrl = orders.trackingUrl ? orders.trackingUrl : '';
      const commande = await this.prismaService.commande.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          shippingMethod: orders.shipping.name,
          shippingAddress: shippingAddress,
          trackingUrl: trackingUrl,
          state: orders.state,
          payment: orders.payment.done,
        },
      });
      commandes.push(commande);
      for (const products of orders.items) {
        const selectedProduct =
          await this.productService.getProductByNaturabuyId(products.id);
        await this.prismaService.commandeProduit.create({
          data: {
            quantity: products.quantity,
            produit: {
              connect: {
                id: selectedProduct.id,
              },
            },
            commande: {
              connect: {
                id: commande.id,
              },
            },
          },
        });
        await this.productService.updateProductQuantity(
          selectedProduct.id,
          selectedProduct.quantity - products.quantity,
        );
      }
    }
    return commandes;
  }
}
