import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Body,
  Request,
} from '@nestjs/common';
import { CommandeProduitService } from './commande-produit.service';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RoleGuard } from 'src/auth/role/role.guard';
@Controller('commande-produit')
@ApiTags('commande-produit')
export class CommandeProduitController {
  constructor(
    private readonly commandeProduitService: CommandeProduitService,
  ) {}

  @Get('get/:id')
  @Roles('user')
  @UseGuards(RoleGuard)
  async getCommandeFromCommandeId(
    @Param('id') id: number,
    @Request() req: Request & { user: any },
  ) {
    return this.commandeProduitService.getProduitFromCommande(id, req);
  }

  @Delete('delete')
  @Roles('user')
  @UseGuards(RoleGuard)
  async deleteProductFromCommande(
    @Body() param: any,
    @Request() req: Request & { user: any },
  ) {
    return this.commandeProduitService.deleteProductFromCommande(
      param.id_commande,
      param.id_produit,
      req,
    );
  }
}
