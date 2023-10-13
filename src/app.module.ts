import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { APP_PIPE } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PanierItemController } from './panier-item/panier-item.controller';
import { PanierItemService } from './panier-item/panier-item.service';
import { PanierItemModule } from './panier-item/panier-item.module';
import { PanierService } from './panier/panier.service';
import { PanierModule } from './panier/panier.module';
@Module({
  imports: [PrismaModule, UserModule, AuthModule, PanierItemModule, PanierModule],
  controllers: [AppController, UserController, PanierItemController],
  providers: [
    AppService,
    PrismaService,
    UserService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    PanierItemService,
    PanierService,
  ],
})
export class AppModule {}
