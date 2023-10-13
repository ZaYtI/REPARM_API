import { Injectable } from '@nestjs/common';
import { AddProductDto } from 'src/dto/add-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PanierItemService {
  constructor(private readonly prismaService: PrismaService) {}

  async addProductToPanier(addProductDto: AddProductDto): Promise<any | null> {
    const { produitId, quantity, panierId } = addProductDto;
    const panierProduit = await this.prismaService.panierProduit.create({
      data: {
        produitId,
        quantity,
        panierId,
      },
    });

    return panierProduit;
  }
}
