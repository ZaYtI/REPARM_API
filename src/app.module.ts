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
@Module({
  imports: [PrismaModule, UserModule, AuthModule],
  controllers: [AppController, UserController],
  providers: [
    AppService,
    PrismaService,
    UserService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
