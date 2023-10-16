import { Body, Controller, Delete, Get, Post, Request } from '@nestjs/common';
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
    await this.panierItemService.addProductToPanier({
      produitId,
      quantity,
      panierId: req.user.panierId,
    });
    return this.panierItemService.getAllProductsFromPanier(req.user.panierId);
  }

  @Get()
  async getAllProductsFromPanier(@Request() req: any): Promise<any> {
    return this.panierItemService.getAllProductsFromPanier(req.user.panierId);
  }

  @Get('price')
  async getPriceFromPanier(@Request() req: any): Promise<any> {
    return this.panierItemService.getPriceFromPanier(req.user.panierId);
  }

  @Delete()
  async deleteProductToPanier(@Body() produit: any, @Request() req: any) {
    const produitId = produit.produitId;
    await this.panierItemService.deleteProductToPanier(
      produitId,
      req.user.panierId,
    );
    return this.panierItemService.getAllProductsFromPanier(req.user.panierId);
  }
}
