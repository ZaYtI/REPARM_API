import { Test, TestingModule } from '@nestjs/testing';
import { CommandeProduitController } from './commande-produit.controller';
import { CommandeProduitService } from './commande-produit.service';

describe('CommandeProduitController', () => {
  let controller: CommandeProduitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommandeProduitController],
      providers: [CommandeProduitService],
    }).compile();

    controller = module.get<CommandeProduitController>(CommandeProduitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
