import { Module } from '@nestjs/common';
import { CommandeService } from './commande.service';
import { CommandeController } from './commande.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductModule } from 'src/product/product.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [PrismaModule, UserModule, ProductModule, MailModule],
  controllers: [CommandeController],
  providers: [CommandeService, PrismaService],
  exports: [CommandeService],
})
export class CommandeModule {}
