import {
  Controller,
  Get,
  Param,
  Request,
  Delete,
  Post,
  Injectable,
} from '@nestjs/common';
import { CommandeService } from './commande.service';
import { CommandeInterface } from './interface/commande.interface';
import { ApiTags } from '@nestjs/swagger';
import axios from 'axios';

@Controller('commande')
@ApiTags('commande')
@Injectable()
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

  @Post('create')
  async createCommande(@Request() req: any): Promise<CommandeInterface> {
    return this.commandeService.createCommande(req.user.id);
  }

  @Get('naturabuyOrder')
  async getNaturabuyOrder(): Promise<any> {
    try {
      const apiUrl = 'https://api.naturabuy.fr/v5/user/orders';
      const token = process.env.NATURABUY_TOKEN;
      const action = 'getOrders';
      const params = {
        action: action,
        token: token,
        period: 'month',
      };
      const response = await axios.get(apiUrl, { params });
      await this.commandeService.createCommandeFromNaturabuy(response.data);
      return response.data;
    } catch (e) {
      console.log(e);
    }
  }
}
