import { Injectable } from '@nestjs/common';
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

  async addProductToPanier(addProductDto: AddProductDto): Promise<any | null> {
    const { ...data } = addProductDto;
    const panierProduit = await this.prismaService.panierProduit.create({
      data: {
        ...data,
      },
    });
    const produit = await this.produitService.getProductById(
      addProductDto.produitId,
    );
    await this.panierService.updatePrice(
      produit.price,
      addProductDto.quantity,
      addProductDto.panierId,
    );
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
}
