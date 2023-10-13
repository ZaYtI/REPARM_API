import { Body, Controller, Post } from '@nestjs/common';
import { PanierItemService } from './panier-item.service';
import { AddProductDto } from 'src/dto/add-product.dto';

@Controller('panier-item')
export class PanierItemController {
  constructor(private readonly panierItemService: PanierItemService) {}

  @Post()
  async addProductToPanier(@Body() addProductDto: AddProductDto) {
    return this.panierItemService.addProductToPanier(addProductDto);
  }
}
