import { Module } from '@nestjs/common';
import { PanierService } from './panier.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PanierService],
  exports: [PanierService],
})
export class PanierModule {}
