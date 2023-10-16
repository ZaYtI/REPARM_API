import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { PanierItemService } from './panier-item.service';
import { RequestAddProductDto } from 'src/dto/request-add-product.dto';

@Controller('panier-item')
export class PanierItemController {
  constructor(private readonly panierItemService: PanierItemService) {}

  @Post()
  async addProductToPanier(
    @Body() { produitId, quantity }: RequestAddProductDto,
    @Request() req: any,
  ): Promise<any> {
    return this.panierItemService.addProductToPanier({
      produitId,
      quantity,
      panierId: req.user.panierId,
    });
  }

  @Get()
  async getAllProductsFromPanier(@Request() req: any): Promise<any> {
    return this.panierItemService.getAllProductsFromPanier(req.user.panierId);
  }
}
