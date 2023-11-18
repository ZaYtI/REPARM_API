import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PanierService {
  constructor(private readonly prismaService: PrismaService) {}

  async createPanier(userId: number): Promise<any | null> {
    const havePanier = await this.prismaService.panier.findFirst({
      where: {
        user: {
          id: userId,
        },
      },
    });
    if (havePanier) {
      return null;
    } else {
      return this.prismaService.panier.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }
  }

  async updatePrice(
    product: any,
    quantity: number,
    panierId: number,
  ): Promise<any> {
    const updatedPrice = await this.prismaService.panier.update({
      where: {
        id: panierId,
      },
      data: {
        price: product.price * quantity,
      },
    });
    return updatedPrice;
  }
}
