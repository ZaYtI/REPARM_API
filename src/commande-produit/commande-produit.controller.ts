import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Request,
  Post,
} from '@nestjs/common';
import { CommandeProduitService } from './commande-produit.service';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RoleGuard } from 'src/auth/role/role.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequestUserInterface } from 'src/auth/interface/requestUser.interface';
@Controller('commande-produit')
@ApiTags('commande-produit')
export class CommandeProduitController {
  constructor(
    private readonly commandeProduitService: CommandeProduitService,
  ) {}

  @Get('/get/:id')
  @Roles('user')
  @UseGuards(RoleGuard, AuthGuard)
  async getProduitFromCommandeId(
    @Param('id') id: number,
    @Request() req: Request & { user: RequestUserInterface },
  ) {
    return this.commandeProduitService.getProduitFromCommande(Number(id), req);
  }

  @Delete('/delete/:id_commande/:id_produit')
  @Roles('user')
  @UseGuards(RoleGuard, AuthGuard)
  async deleteProductFromCommandeId(
    @Param('id_commande') id_commande: number,
    @Param('id_produit') id_produit: number,
    @Request() req: Request & { user: RequestUserInterface },
  ) {
    return this.commandeProduitService.deleteProductFromCommande(
      Number(id_commande),
      Number(id_produit),
      req,
    );
  }

  @Post('/create')
  @Roles('user')
  @UseGuards(RoleGuard, AuthGuard)
  async createCommandeWithPanier(
    @Request() req: Request & { user: RequestUserInterface },
  ) {
    return this.commandeProduitService.createCommandeWithPanier(req);
  }
}
