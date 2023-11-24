import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PanierService } from 'src/panier/panier.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BlackListService } from 'src/black-list/black-list.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  private salt: Promise<string>;
  private jwtTimeExp = 300000;
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private panierService: PanierService,
    private prismaService: PrismaService,
    private blackListService: BlackListService,
  ) {
    this.salt = bcrypt.genSalt();
  }

  async login(signInDto: LoginDto) {
    const user = await this.userService.findOneByEmail({
      email: signInDto.email,
    });
    const auth = await this.prismaService.auth.findFirst({
      where: {
        userId: user.id,
      },
    });
    if (auth) {
      await this.blackListService.addTokenWithUserAndDate(
        auth.token,
        user.id,
        auth.ExpirationToken,
      );
      await this.prismaService.auth.delete({
        where: {
          userId: user.id,
        },
      });
    }
    if (!user || !signInDto.password) {
      throw new UnauthorizedException();
    }
    const isMatch = await bcrypt.compare(signInDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: user.id,
      email: user.email,
    };
    const jwtToken = this.jwtService.sign(payload);
    const cryptedJwtToken = await bcrypt.hash(jwtToken, await this.salt);
    await this.prismaService.auth.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        token: cryptedJwtToken,
        ExpirationToken: Date.now() + this.jwtTimeExp,
      },
    });
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: CreateUserDto) {
    const user = await this.userService.createUser(registerDto);
    await this.panierService.createPanier(user.id);
    const payload = {
      sub: user.id,
      email: user.email,
    };
    const jwtToken = this.jwtService.sign(payload);
    const cryptedJwtToken = await bcrypt.hash(jwtToken, await this.salt);
    await this.prismaService.auth.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        token: cryptedJwtToken,
        ExpirationToken: Date.now() + this.jwtTimeExp,
      },
    });
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout(id: number, token: string) {
    const decryptedToken = await bcrypt.hash(token, await this.salt);
    await this.prismaService.auth.delete({
      where: {
        userId: id,
        token: decryptedToken,
      },
    });
    return { message: 'your logged out' };
  }

  async findByIdUser(id: number): Promise<User> {
    const user = await this.userService.findOneById(id);
    return user;
  }

  async deleteExpiredRefreshTokens() {
    const auths = await this.prismaService.auth.findMany();
    const now = Date.now();
    for (const auth of auths) {
      if (auth.ExpirationToken <= now) {
        await this.prismaService.auth.delete({
          where: {
            userId: auth.userId,
          },
        });
      }
    }
  }
}
