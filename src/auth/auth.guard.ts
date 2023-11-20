import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private userService: UserService;
  private authService: AuthService;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (this.authService.findByIdUser(request.user.id)) {
      if (this.authService.verifyToken(request.headers.authorization)) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  }
}
