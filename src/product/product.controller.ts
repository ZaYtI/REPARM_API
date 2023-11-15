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
import { ApiTags } from '@nestjs/swagger';

@Controller('product')
@ApiTags('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('getById/:id')
  async getProductById(@Param('id') id: number) {
    return this.productService.getProductById(id);
  }

  @Get('/getall')
  async getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Post('/create')
  async createProduct(@Body() newproductdto: NewProductDto) {
    return this.productService.createProduct(newproductdto);
  }

  @Put('update/:id')
  async updateProduct(
    @Param('id') id: number,
    @Body() newproductdto: NewProductDto,
  ) {
    return this.productService.updateProduct(id, newproductdto);
  }

  @Delete('/delete/:id')
  async deleteProduct(@Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }

  @Get('/exportcsv')
  async exportCSV() {
    return this.productService.exportCSV();
  }
}
