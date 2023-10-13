import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
import { AuthService } from 'src/auth/auth.service';
import { PanierService } from 'src/panier/panier.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, AuthService, PanierService],
  exports: [UserService],
})
export class UserModule {}
