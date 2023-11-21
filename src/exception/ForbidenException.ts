// forbidden.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor(message: string = 'Forbidden resource') {
    super({ message, error: 'Forbidden' }, HttpStatus.FORBIDDEN);
  }
}
