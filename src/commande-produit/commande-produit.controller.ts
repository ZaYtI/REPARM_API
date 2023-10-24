import { Controller } from '@nestjs/common';
import { CommandeProduitService } from './commande-produit.service';

@Controller('commande-produit')
export class CommandeProduitController {
  constructor(private readonly commandeProduitService: CommandeProduitService) {}
}
