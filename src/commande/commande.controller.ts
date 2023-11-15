import {
  Controller,
  Get,
  Param,
  Request,
  Delete,
  Put,
  Post,
} from '@nestjs/common';
import { CommandeService } from './commande.service';
import { CommandeInterface } from './interface/commande.interface';
import { ApiTags } from '@nestjs/swagger';

@Controller('commande')
@ApiTags('commande')
export class CommandeController {
  constructor(private readonly commandeService: CommandeService) {}

  @Get('get/:id')
  async getCommandeById(@Param('id') id: number) {
    console.log(id);
    return this.commandeService.getCommandeById(id);
  }

  @Get('user')
  async getCommandeByUserId(@Request() req: any): Promise<CommandeInterface[]> {
    return this.commandeService.getCommandeByUserId(req.user.id);
  }

  @Delete('delete/:id')
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

  @Post('create')
  async createCommande(@Request() req: any): Promise<CommandeInterface> {
    return this.commandeService.createCommande(req.user.id);
  }
}
