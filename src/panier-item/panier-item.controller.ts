import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  Put,
} from '@nestjs/common';
import { PanierItemService } from './panier-item.service';
import { RequestAddProductDto } from 'src/panier-item/dto/request-add-product.dto';
import { ApiTags } from '@nestjs/swagger';
@Controller('panier-item')
@ApiTags('panier-item')
export class PanierItemController {
  constructor(private readonly panierItemService: PanierItemService) {}

  @Post()
  async addProductToPanier(
    @Body() requestAddProduct: RequestAddProductDto,
    @Request() req: any,
  ): Promise<any> {
    const { ...data } = requestAddProduct;
    await this.panierItemService.addProductToPanier({
      ...data,
      panierId: req.user.panierId,
    });
    return this.panierItemService.getAllProductsFromPanier(req.user.panierId);
  }

  @Get()
  async getAllProductsFromPanier(@Request() req: any): Promise<any> {
    return this.panierItemService.getAllProductsFromPanier(req.user.panierId);
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

  @Put()
  async updateProductQuantity(
    @Body() produit: any,
    @Request() req: any,
  ): Promise<any> {
    const produitId = produit.produitId;
    const quantity = produit.quantity;
    await this.panierItemService.updateProductQuantity(
      produitId,
      req.user.panierId,
      quantity,
    );
    return this.panierItemService.getAllProductsFromPanier(req.user.panierId);
  }
}
