import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PanierItemService } from './panier-item.service';
import { ApiTags } from '@nestjs/swagger';
import { AddProductDto } from './dto/add-product.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RoleGuard } from 'src/auth/role/role.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequestUserInterface } from 'src/auth/interface/requestUser.interface';
@Controller('panier-item')
@ApiTags('panier-item')
export class PanierItemController {
  constructor(private readonly panierItemService: PanierItemService) {}

  @Post()
  @Roles('user')
  @UseGuards(RoleGuard, AuthGuard)
  async addProductToPanier(
    @Body() addProductDto: AddProductDto,
    @Request() req: Request & { user: RequestUserInterface },
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
  async getAllProductsFromPanier(
    @Request() req: Request & { user: RequestUserInterface },
  ): Promise<any> {
    return this.panierItemService.getAllProductsFromPanierByUserId(
      req.user.sub,
    );
  }

  @Delete()
  @Roles('user')
  @UseGuards(RoleGuard, AuthGuard)
  async deleteProductToPanier(
    @Body() produitId: number,
    @Request() req: Request & { user: RequestUserInterface },
  ): Promise<any> {
    return await this.panierItemService.deleteProductToPanier(
      produitId,
      req.user.sub,
    );
  }
}
