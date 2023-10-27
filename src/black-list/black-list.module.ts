import { Module } from '@nestjs/common';
import { BlackListService } from './black-list.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [BlackListService],
  exports: [BlackListService],
})
export class BlackListModule {}
