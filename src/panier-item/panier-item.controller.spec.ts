import { Test, TestingModule } from '@nestjs/testing';
import { PanierItemController } from './panier-item.controller';

describe('PanierItemController', () => {
  let controller: PanierItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PanierItemController],
    }).compile();

    controller = module.get<PanierItemController>(PanierItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
