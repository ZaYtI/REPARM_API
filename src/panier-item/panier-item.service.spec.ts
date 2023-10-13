import { Test, TestingModule } from '@nestjs/testing';
import { PanierItemService } from './panier-item.service';

describe('PanierItemService', () => {
  let service: PanierItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PanierItemService],
    }).compile();

    service = module.get<PanierItemService>(PanierItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
