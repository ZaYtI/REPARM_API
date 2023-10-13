import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from 'src/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(signInDto: LoginDto) {
    const user = await this.userService.findOneByEmail({
      email: signInDto.email,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.password !== signInDto.password) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, email: user.email };
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
}
