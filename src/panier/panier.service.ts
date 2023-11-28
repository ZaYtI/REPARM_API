import { Injectable } from '@nestjs/common';
import { Panier } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PanierService {
  constructor(private readonly prismaService: PrismaService) {}

  async getPanierByUserId(userId: number): Promise<Panier> {
    return this.prismaService.panier.findUnique({
      where: {
        userId,
      },
    });
  }

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

  async updatePrice(price: number, panierId: number) {
    const updatedPrice = await this.prismaService.panier.update({
      where: {
        id: panierId,
      },
      data: {
        price: price,
      },
    });
    return updatedPrice;
  }
}
