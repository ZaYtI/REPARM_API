import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { newProductDto } from 'src/dto/new-product.dto';
import { IsAdminGuard } from 'src/is-admin/is-admin.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':id')
  async getProductById(@Param('id') id: number) {
    return this.productService.getProductById(id);
  }

  @Get()
  async getAllProducts() {
    return this.productService.getAllProducts();
  }

  @UseGuards(IsAdminGuard)
  @Post()
  async createProduct(@Body() newproductdto: newProductDto) {
    return this.productService.createProduct(newproductdto);
  }

  @UseGuards(IsAdminGuard)
  @Put(':id')
  async updateProduct(
    @Param('id') id: number,
    @Body() newproductdto: newProductDto,
  ) {
    return this.productService.updateProduct(id, newproductdto);
  }

  @UseGuards(IsAdminGuard)
  @Delete(':id')
  async deleteProduct(@Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }
}
