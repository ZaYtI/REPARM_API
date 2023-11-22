import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  matchRoles(allowedRoles: string[], userRole: string) {
    if (
      (allowedRoles.includes('admin') || allowedRoles.includes('user')) &&
      userRole === 'admin'
    ) {
      return true;
    }
    return allowedRoles.some((role) => userRole?.includes(role));
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const allowedRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!allowedRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (this.matchRoles(allowedRoles, user.role)) {
      return true;
    } else {
      throw new ForbiddenException(
        'Vous ne possédez pas les droits pour cette requête',
      );
    }
  }
}
