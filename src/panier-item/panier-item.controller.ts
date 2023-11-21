import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PanierItemService } from './panier-item.service';
import { ApiTags } from '@nestjs/swagger';
import { AddProductDto } from './dto/add-product.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RoleGuard } from 'src/auth/role/role.guard';
@Controller('panier-item')
@ApiTags('panier-item')
export class PanierItemController {
  constructor(private readonly panierItemService: PanierItemService) {}

  @Post()
  @Roles('user')
  @UseGuards(RoleGuard)
  async addProductToPanier(
    @Body() addProductDto: AddProductDto,
    @Request() req: any,
  ): Promise<any> {
    await this.panierItemService.addProductToPanier(addProductDto);
    return this.panierItemService.getAllProductsFromPanierByUserId(req.user.id);
  }

  @Get()
  @Roles('user')
  @UseGuards(RoleGuard)
  async getAllProductsFromPanier(@Request() req: any): Promise<any> {
    return this.panierItemService.getAllProductsFromPanierByUserId(req.user.id);
  }

  @Delete()
  @Roles('user')
  @UseGuards(RoleGuard)
  async deleteProductToPanier(@Body() produit: any, @Request() req: any) {
    const produitId = produit.id;
    await this.panierItemService.deleteProductToPanier(produitId, req.user.id);
    return this.panierItemService.getAllProductsFromPanierByUserId(req.user.id);
  }

  @Put()
  @Roles('user')
  @UseGuards(RoleGuard)
  async updateProductQuantity(
    @Body() produit: any,
    @Request() req: any,
  ): Promise<any> {
    const produitId = produit.produitId;
    const quantity = produit.quantity;
    await this.panierItemService.updateProductQuantity(
      produitId,
      req.user.id,
      quantity,
    );
    return this.panierItemService.getAllProductsFromPanierByUserId(req.user.id);
  }
}
