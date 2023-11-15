import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { NewProductDto } from './dto/new-product.dto';

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

  @Post('/create')
  async createProduct(@Body() newproductdto: NewProductDto) {
    return this.productService.createProduct(newproductdto);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: number,
    @Body() newproductdto: NewProductDto,
  ) {
    return this.productService.updateProduct(id, newproductdto);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }
}
