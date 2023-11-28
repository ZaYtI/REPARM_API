import { Module } from '@nestjs/common';
import { PanierModule } from 'src/panier/panier.module';
import { ProductModule } from 'src/product/product.module';
import { PanierItemController } from './panier-item.controller';
import { PanierItemService } from './panier-item.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PanierModule, ProductModule, PrismaModule],
  controllers: [PanierItemController],
  providers: [PanierItemService],
  exports: [PanierItemService],
})
export class PanierItemModule {}
