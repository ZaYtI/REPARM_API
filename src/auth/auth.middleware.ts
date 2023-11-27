import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { BlackListService } from 'src/black-list/black-list.service';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private readonly blackListService: BlackListService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractTokenFromHeader(req);

    if (!token) {
      throw new UnauthorizedException("il n'y a aucun token fournis");
    }

    try {
      const payload = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const isBlackListed = !!(await this.blackListService.findToken(token));

      const isAuth = await this.authService.isAuth(payload.sub);

      if (isBlackListed || !isAuth) {
        throw new UnauthorizedException(
          'ce token a deja était utilisé ou est invalide',
        );
      } else {
        const role = await this.userService.findRoleUser(payload.sub);
        payload.role = role.role.name;
        payload.isAuth = isAuth;
        payload.isBlackListed = isBlackListed;
        req['user'] = payload;
      }

      next();
    } catch (error) {
      throw new UnauthorizedException('token invalide');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
