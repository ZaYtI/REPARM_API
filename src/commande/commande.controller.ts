import {
  Controller,
  Get,
  Param,
  Request,
  Delete,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { CommandeService } from './commande.service';
import { CommandeInterface } from './interface/commande.interface';
import { ApiTags } from '@nestjs/swagger';
import axios from 'axios';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RoleGuard } from 'src/auth/role/role.guard';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('commande')
@ApiTags('commande')
@Injectable()
@UseGuards(AuthGuard)
export class CommandeController {
  constructor(private readonly commandeService: CommandeService) {}

  @Get('get/:id')
  @Roles('admin')
  @UseGuards(RoleGuard, AuthGuard)
  async getCommandeById(@Param('id') id: number) {
    return this.commandeService.getCommandeById(id);
  }

  @Get('user')
  @Roles('user')
  @UseGuards(RoleGuard, AuthGuard)
  async getCommandeByUserId(@Request() req: any): Promise<CommandeInterface[]> {
    return this.commandeService.getCommandeByUserId(req.user.sub);
  }

  @Delete('delete/:id')
  @Roles('admin')
  @UseGuards(RoleGuard, AuthGuard)
  async deleteCommande(@Param('id') id: number) {
    return this.commandeService.deleteCommande(id);
  }

  @Get('naturabuyOrder')
  @Roles('admin')
  @UseGuards(RoleGuard, AuthGuard)
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
      throw new Error(e);
    }
  }
}
