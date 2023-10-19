import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from 'src/dto/login.dto';
import { CreateUserDto } from 'src/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PanierService } from 'src/panier/panier.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  private salt: Promise<string>;
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private panierService: PanierService,
    private prismaService: PrismaService,
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
      throw new UnauthorizedException('User already logged in');
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
      panierId: user.panier.id,
      role: user.role.name,
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
      },
    });
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: CreateUserDto) {
    const user = await this.userService.createUser(registerDto);
    const panier = await this.panierService.createPanier(user.id);
    const payload = {
      sub: user.id,
      email: user.email,
      panierId: panier.id,
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
      },
    });
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateToken(token: string) {
    const payload = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    const user = await this.userService.findOneByEmail({
      email: payload.email,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
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
}
