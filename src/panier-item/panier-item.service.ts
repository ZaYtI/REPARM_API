import { Injectable, NotFoundException } from '@nestjs/common';
import { Panier } from '@prisma/client';
import { AddProductDto } from 'src/panier-item/dto/add-product.dto';
import { PanierService } from 'src/panier/panier.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from 'src/product/product.service';
import { productWithQuantityInterface } from './interface/productWithQuantitty.interface';
import { productWithQuantityRequestInterface } from './interface/productWithQuantityRequest.interface';

@Injectable()
export class PanierItemService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly panierService: PanierService,
    private readonly produitService: ProductService,
  ) {}

  async getPanierFromUserId(userId: number): Promise<Panier> {
    const panier = this.prismaService.panier.findUnique({
      where: {
        userId,
      },
    });
    return panier;
  }

  async addProductToPanier(addProductDto: AddProductDto, userId: number) {
    const panier = await this.panierService.getPanierByUserId(userId);
    const produit = await this.produitService.getProductById(
      addProductDto.produitId,
    );
    if (produit != null) {
      const panierProduit = await this.prismaService.panierProduit.create({
        data: {
          panierId: panier.id,
          produitId: addProductDto.produitId,
          quantity: addProductDto.quantity,
        },
      });
      await this.panierService.updatePrice(
        produit.price + produit.price * addProductDto.quantity,
        panier.id,
      );
      return panierProduit;
    } else {
      throw new NotFoundException('Produit not found');
    }
  }

  async deleteProductToPanier(
    produitWithQuantity: productWithQuantityRequestInterface,
    userId: number,
  ) {
    const panier = await this.getPanierFromUserId(userId);
    const panierProduit = await this.prismaService.panierProduit.findMany({
      where: {
        panierId: panier.id,
      },
    });
    let deleted = 0;
    for (const prod of panierProduit) {
      if (
        prod.produitId == produitWithQuantity.produitId &&
        deleted < produitWithQuantity.quantity
      ) {
        deleted++;
        await this.prismaService.panierProduit.delete({
          where: {
            id: prod.id,
            panierId: panier.id,
          },
        });
      }
    }
    return await this.getAllProductsFromPanierByUserId(userId);
  }

  async getAllProductsFromPanierByUserId(userId: number) {
    const panier = await this.getPanierFromUserId(userId);
    const panierProduits = await this.prismaService.panierProduit.findMany({
      where: {
        panierId: panier.id,
      },
      include: {
        produit: true,
      },
    });

    const productsDict: { [key: number]: productWithQuantityInterface } = {};

    for (const panierProduit of panierProduits) {
      const { produit, quantity } = panierProduit;

      if (!productsDict[produit.id]) {
        productsDict[produit.id] = {
          produit: {
            ...produit,
          },
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

  async deleteAllProductsFromPanierByUserId(sub: any) {
    return this.prismaService.panierProduit.deleteMany({
      where: {
        panier: {
          userId: sub,
        },
      },
    });
  }

  async updatePriceFromUserId(userId: number) {
    const panier = await this.getPanierFromUserId(userId);
    const panierProduits = await this.prismaService.panierProduit.findMany({
      where: {
        panierId: panier.id,
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
    return this.prismaService.panier.update({
      where: {
        id: panier.id,
      },
      data: {
        price,
      },
    });
  }
}
