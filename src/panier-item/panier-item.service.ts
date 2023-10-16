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

  async deleteProductToPanier(produitId: number, panierId: number) {
    const panierProduit = await this.prismaService.panierProduit.deleteMany({
      where: {
        produitId,
        panierId,
      },
    });
    return panierProduit;
  }

  async getAllProductsFromPanier(panierId: number): Promise<any[] | null> {
    const panierProduits = await this.prismaService.panierProduit.findMany({
      where: {
        panierId,
      },
      include: {
        produit: true,
      },
    });

    const productsDict: { [key: number]: any } = {};

    for (const panierProduit of panierProduits) {
      const { produit, quantity } = panierProduit;

      if (!productsDict[produit.id]) {
        productsDict[produit.id] = {
          ...produit,
          quantity,
        };
      } else {
        productsDict[produit.id].quantity += quantity;
      }
    }

    const distinctProducts = Object.values(productsDict);

    return distinctProducts;
  }

  async getPriceFromPanier(panierId: number): Promise<number> {
    const panierProduits = await this.prismaService.panierProduit.findMany({
      where: {
        panierId,
      },
      include: {
        produit: true,
      },
    });

    let price = 0;

    for (const panierProduit of panierProduits) {
      const { produit, quantity } = panierProduit;
      price += produit.price * quantity;
    }

    return price;
  }

  async updateProductQuantity(
    produitId: number,
    panierId: number,
    quantity: number,
  ): Promise<any> {
    const panierProduit = await this.prismaService.panierProduit.updateMany({
      where: {
        produitId,
        panierId,
      },
      data: {
        quantity,
      },
    });
    return panierProduit;
  }

  async incrementProductQuantity(
    produitId: number,
    panierId: number,
  ): Promise<any> {
    const panierProduit = await this.prismaService.panierProduit.updateMany({
      where: {
        produitId,
        panierId,
      },
      data: {
        quantity: {
          increment: 1,
        },
      },
    });
    return panierProduit;
  }

  async decrementProductQuantity(
    produitId: number,
    panierId: number,
  ): Promise<any> {
    const panierProduit = await this.prismaService.panierProduit.updateMany({
      where: {
        produitId,
        panierId,
      },
      data: {
        quantity: {
          decrement: 1,
        },
      },
    });
    return panierProduit;
  }
}
