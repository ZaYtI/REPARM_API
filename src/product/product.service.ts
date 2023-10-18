import { Injectable } from '@nestjs/common';
import { newProductDto } from 'src/dto/new-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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

  async createProduct(newProductDto: newProductDto) {
    const { name, price, CategorieId } = newProductDto;
    return this.prismaService.produit.create({
      data: {
        name,
        price,
        categorie: {
          connect: {
            id: CategorieId,
          },
        },
      },
    });
  }

  async updateProduct(id: number, newproductdto: newProductDto) {
    const { name, price, CategorieId } = newproductdto;
    return this.prismaService.produit.update({
      where: { id },
      data: {
        name,
        price,
        categorie: {
          connect: {
            id: CategorieId,
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
}
