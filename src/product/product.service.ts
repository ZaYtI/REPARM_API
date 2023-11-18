import { Injectable } from '@nestjs/common';
import { NewProductDto } from 'src/product/dto/new-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as path from 'path';
import * as fs from 'fs';
@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllProducts() {
    return this.prismaService.produit.findMany();
  }

  async getProductById(id: number) {
    return this.prismaService.produit.findUnique({
      where: { id },
    });
  }

  async createProduct(newProductDto: NewProductDto) {
    const { categorieId, ...rest } = newProductDto;
    return this.prismaService.produit.create({
      data: {
        ...rest,
        categorie: {
          connect: {
            id: categorieId,
          },
        },
      },
    });
  }

  async updateProduct(id: number, newproductdto: NewProductDto) {
    const { categorieId, ...rest } = newproductdto;
    return this.prismaService.produit.update({
      where: { id },
      data: {
        ...rest,
        categorie: {
          connect: {
            id: categorieId,
          },
        },
      },
    });
  }

  async deleteProduct(id: number) {
    return this.prismaService.produit.delete({
      where: { id },
    });
  }

  async exportCSV() {
    const produits = await this.getAllProducts();
    const header = 'id|nom|prix|categorieId\n';
    const rows = produits
      .map((p) => `${p.id}|${p.name}|${p.price}|${p.categorieId}`)
      .join('\n');
    const csv = header + rows;
    console.log(csv);
    const filePath = path.resolve(
      __dirname,
      '../../src/product',
      'produits.csv',
    );
    fs.writeFileSync(filePath, csv);
    return filePath;
  }

  async updateProductQuantity(id: number, quantity: number) {
    return this.prismaService.produit.update({
      where: { id },
      data: {
        quantity,
      },
    });
  }

  async getProductByNaturabuyId(naturaBuyId: string) {
    return this.prismaService.produit.findUnique({
      where: { naturaBuyId },
    });
  }
}
