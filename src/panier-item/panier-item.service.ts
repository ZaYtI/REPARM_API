import { Injectable } from '@nestjs/common';
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
    const panier = this.getPanierFromUserId(userId);
    return panier;
  }

  async addProductToPanier(addProductDto: AddProductDto): Promise<any | null> {
    const panier = await this.panierService.getPanierByUserId(
      addProductDto.userId,
    );
    const panierProduit = await this.prismaService.panierProduit.create({
      data: {
        panierId: panier.id,
        produitId: addProductDto.produitId,
        quantity: addProductDto.quantity,
      },
    });
    const produit = await this.produitService.getProductById(
      addProductDto.produitId,
    );
    await this.panierService.updatePrice(produit.price, produit.id, panier.id);
    return panierProduit;
  }

  async deleteProductToPanier(produitId: number, userId: number) {
    const panier = await this.getPanierFromUserId(userId);
    const panierProduit = await this.prismaService.panierProduit.deleteMany({
      where: {
        produitId,
        panierId: panier.id,
      },
    });
    return panierProduit;
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
