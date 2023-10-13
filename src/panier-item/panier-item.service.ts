import { Injectable } from '@nestjs/common';
import { AddProductDto } from 'src/dto/add-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PanierItemService {
  constructor(private readonly prismaService: PrismaService) {}

  async addProductToPanier(addProductDto: AddProductDto): Promise<any | null> {
    return this.prismaService.panierProduit.create({
      data: {
        produit: {
          connect: {
            id: addProductDto.produitId,
          },
        },
        quantity: addProductDto.quantity,
        panier: {
          connect: {
            id: addProductDto.panierId,
          },
        },
      },
    });
  }
}
