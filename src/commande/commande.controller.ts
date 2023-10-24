import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Delete,
  Put,
} from '@nestjs/common';
import { CommandeService } from './commande.service';
import { IsAdminGuard } from 'src/is-admin/is-admin.guard';
import { CommandeInterface } from './interface/commande.interface';

@Controller('commande')
export class CommandeController {
  constructor(private readonly commandeService: CommandeService) {}

  @Get(':id')
  @UseGuards(IsAdminGuard)
  async getCommandeById(@Param('id') id: number) {
    return this.commandeService.getCommandeById(id);
  }

  @Get('user')
  async getCommandeByUserId(@Request() req: any): Promise<CommandeInterface> {
    return this.commandeService.getCommandeByUserId(req.user.id);
  }

  @Delete(':id')
  @UseGuards(IsAdminGuard)
  async deleteCommande(@Param('id') id: number) {
    return this.commandeService.deleteCommande(id);
  }

  @Put('validate/:id')
  async updateValidationCommande(
    @Param('id') id: number,
    @Request() req: any,
  ): Promise<CommandeInterface> {
    return this.commandeService.updateValidationCommande(id, req.user.id);
  }
}
