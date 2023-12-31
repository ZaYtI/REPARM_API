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
      throw new UnauthorizedException("Il n'y a aucun token fourni");
    }

    let payload;

    try {
      payload = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const isBlackListed = await this.blackListService.isBlackListed(token);

      const isAuth = await this.authService.isAuth(payload.sub);

      if (isBlackListed || !isAuth) {
        throw new UnauthorizedException(
          'Ce token a déjà été utilisé ou est invalide',
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
      if (payload) {
        this.authService.deleteExpiredTokensFromUserId(payload.sub);
        this.blackListService.addTokenWithUserAndDate(
          token,
          payload.sub,
          payload.exp,
        );
      }
      throw new UnauthorizedException('Token invalide');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
