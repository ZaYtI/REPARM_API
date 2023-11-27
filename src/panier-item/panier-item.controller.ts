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
import { AuthGuard } from 'src/auth/auth.guard';
@Controller('panier-item')
@ApiTags('panier-item')
export class PanierItemController {
  constructor(private readonly panierItemService: PanierItemService) {}

  @Post()
  @Roles('user')
  @UseGuards(RoleGuard, AuthGuard)
  async addProductToPanier(
    @Body() addProductDto: AddProductDto,
    @Request() req: any,
  ): Promise<any> {
    await this.panierItemService.addProductToPanier(
      addProductDto,
      req.user.sub,
    );
    return this.panierItemService.getAllProductsFromPanierByUserId(
      req.user.sub,
    );
  }

  @Get()
  @Roles('user')
  @UseGuards(RoleGuard, AuthGuard)
  async getAllProductsFromPanier(@Request() req: any): Promise<any> {
    return this.panierItemService.getAllProductsFromPanierByUserId(
      req.user.sub,
    );
  }

  @Delete()
  @Roles('user')
  @UseGuards(RoleGuard, AuthGuard)
  async deleteProductToPanier(
    @Body() produitId: number,
    @Request() req: any,
  ): Promise<any> {
    return await this.panierItemService.deleteProductToPanier(
      produitId,
      req.user.sub,
    );
  }

  @Put()
  @Roles('user')
  @UseGuards(RoleGuard, AuthGuard)
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
