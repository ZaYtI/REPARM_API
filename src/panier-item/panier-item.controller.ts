import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { PanierItemService } from './panier-item.service';
import { RequestAddProductDto } from 'src/dto/request-add-product.dto';
import { UserService } from 'src/user/user.service';
import * as jwt from 'jsonwebtoken';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('panier-item')
export class PanierItemController {
  constructor(
    private readonly panierItemService: PanierItemService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
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
}
