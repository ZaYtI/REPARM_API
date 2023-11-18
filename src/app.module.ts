import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
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
import { AuthMiddleware } from './auth/auth.middleware';
import { ProductModule } from './product/product.module';
import { AuthController } from './auth/auth.controller';
import { CronService } from './cron/cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CommandeModule } from './commande/commande.module';
import { CommandeProduitModule } from './commande-produit/commande-produit.module';
// import { CommandeController } from './commande/commande.controller';
import { BlackListService } from './black-list/black-list.service';
import { BlackListModule } from './black-list/black-list.module';
@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    PanierItemModule,
    PanierModule,
    ProductModule,
    ScheduleModule.forRoot(),
    CommandeModule,
    CommandeProduitModule,
    BlackListModule,
  ],
  controllers: [UserController, PanierItemController],
  providers: [
    PrismaService,
    UserService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    PanierItemService,
    PanierService,
    CronService,
    BlackListService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        'auth/login',
        'auth/register',
        'auth/refresh',
        'product',
        'product/:id',
        'auth/login',
        'auth/register',
      )
      .forRoutes(PanierItemController, UserController, AuthController);
  }
}
