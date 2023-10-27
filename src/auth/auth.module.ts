import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { PanierModule } from 'src/panier/panier.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BlackListModule } from 'src/black-list/black-list.module';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '5m' },
    }),
    PanierModule,
    PrismaModule,
    BlackListModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
