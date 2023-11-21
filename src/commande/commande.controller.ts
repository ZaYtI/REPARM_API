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
import { Roles } from 'src/auth/roles/roles.decorator';

@Controller('commande')
@ApiTags('commande')
@Injectable()
export class CommandeController {
  constructor(private readonly commandeService: CommandeService) {}

  @Get('get/:id')
  @Roles('admin')
  async getCommandeById(@Param('id') id: number) {
    return this.commandeService.getCommandeById(id);
  }

  @Get('user')
  @Roles('user')
  async getCommandeByUserId(@Request() req: any): Promise<CommandeInterface[]> {
    return this.commandeService.getCommandeByUserId(req.user.id);
  }

  @Delete('delete/:id')
  @Roles('admin')
  async deleteCommande(@Param('id') id: number) {
    return this.commandeService.deleteCommande(id);
  }

  @Delete('/delete')
  @Roles('user')
  async deleteCommandeByUserId(@Request() req: any): Promise<any> {
    return this.commandeService.deleteCommande(req.user.id);
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
      return await this.commandeService.createCommandeFromNaturabuy(
        response.data,
      );
    } catch (e) {
      console.log(e);
    }
  }
}
