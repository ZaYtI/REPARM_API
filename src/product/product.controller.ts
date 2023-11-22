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
import { NewProductDto } from './dto/new-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RoleGuard } from 'src/auth/role/role.guard';
import { AuthGuard } from 'src/auth//auth.guard';

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
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
  async createProduct(@Body() newproductdto: NewProductDto) {
    return this.productService.createProduct(newproductdto);
  }

  @Put('update/:id')
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
  async updateProduct(
    @Param('id') id: number,
    @Body() newproductdto: NewProductDto,
  ) {
    return this.productService.updateProduct(id, newproductdto);
  }

  @Delete('/delete/:id')
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
  async deleteProduct(@Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }

  @Get('/exportcsv')
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuard)
  async exportCSV() {
    return this.productService.exportCSV();
  }
}
