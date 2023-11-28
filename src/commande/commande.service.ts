import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ProductService } from 'src/product/product.service';
import { MailService } from 'src/mail/mail.service';
import { Commande } from '@prisma/client';

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

  async getCommandeById(commandeId: number): Promise<Commande> {
    return await this.prismaService.commande.findUnique({
      where: {
        id: commandeId,
      },
    });
  }

  async deleteCommande(commandeId: number): Promise<any | null> {
    await this.prismaService.commandeProduit.deleteMany({
      where: {
        commandeId: commandeId,
      },
    });
    await this.prismaService.commande.delete({
      where: {
        id: commandeId,
      },
    });
    return { message: 'Commande deleted' };
  }

  async getCommandeByUserId(userId: number): Promise<Commande[]> {
    return await this.prismaService.commande.findMany({
      where: {
        user: {
          id: userId,
        },
      },
    });
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

    for (const order of naturabuyResponse) {
      const { buyer, shipping, items, state, payment, received } = order;
      let user = await this.userService.findOneByEmail({ email: buyer.email });

      if (!user) {
        const formattedBirthDate = new Date(buyer.birthdate);
        const password = await this.userService.generateRandomPassword();

        const createUserDto: CreateUserDto = {
          postalCode: '',
          nick: buyer.nick,
          civility: buyer.civilite,
          firstName: buyer.firstName,
          lastName: buyer.lastName,
          birthDate: formattedBirthDate,
          address: buyer.address,
          city: buyer.city,
          country: buyer.country,
          phone: buyer.phone,
          email: buyer.email,
          password: password,
          avatar: null,
        };

        user = await this.userService.createUser(createUserDto);
        await this.mailService.sendUserPasswordFromNaturaBuyOrder(
          buyer.email,
          password,
        );
      }

      const shippingAddress =
        shipping.shipping_address?.address ||
        shipping.relay_point_address?.address1 ||
        '';
      const trackingUrl = shipping.tracking_url || '';

      const commande = await this.prismaService.commande.create({
        data: {
          user: { connect: { id: user.id } },
          shippingMethod: shipping.name,
          shippingAddress,
          trackingUrl,
          state,
          payment: payment.done,
          received,
          isNaturaBuyOrder: true,
        },
      });

      commandes.push(commande);

      for (const product of items) {
        const selectedProduct =
          await this.productService.getProductByNaturabuyId(product.id);

        await this.prismaService.commandeProduit.create({
          data: {
            quantity: product.quantity,
            produit: { connect: { id: selectedProduct.id } },
            commande: { connect: { id: commande.id } },
          },
        });

        await this.productService.updateProductQuantity(
          selectedProduct.id,
          selectedProduct.quantity - product.quantity,
        );
      }
    }

    return commandes;
  }
}
