import { Injectable, NotFoundException } from '@nestjs/common';
import { Panier } from '@prisma/client';
import { AddProductDto } from 'src/panier-item/dto/add-product.dto';
import { PanierService } from 'src/panier/panier.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from 'src/product/product.service';

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

  async addProductToPanier(
    addProductDto: AddProductDto,
    userId: number,
  ): Promise<any | null> {
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
    produitId: any,
    userId: number,
  ): Promise<any | null> {
    const panier = await this.getPanierFromUserId(userId);
    const panierProduit = await this.prismaService.panierProduit.findMany({
      where: {
        panierId: panier.id,
      },
    });
    let deleted = 0;
    for (const prod of panierProduit) {
      if (
        prod.produitId == produitId.produitId &&
        deleted < produitId.quantity
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

  async getAllProductsFromPanierByUserId(
    userId: number,
  ): Promise<any[] | null> {
    const panier = await this.getPanierFromUserId(userId);
    const panierProduits = await this.prismaService.panierProduit.findMany({
      where: {
        panierId: panier.id,
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
    userId: number,
    quantity: number,
  ): Promise<any> {
    const panier = await this.getPanierFromUserId(userId);
    const panierProduit = await this.prismaService.panierProduit.updateMany({
      where: {
        produitId,
        panierId: panier.id,
      },
      data: {
        quantity,
      },
    });
    return panierProduit;
  }
}
