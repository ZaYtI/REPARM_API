import { Injectable } from '@nestjs/common';
import { NewProductDto } from 'src/dto/new-product.dto';
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
}
