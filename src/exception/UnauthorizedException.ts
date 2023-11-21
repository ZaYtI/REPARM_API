// forbidden.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedException extends HttpException {
  constructor(message: string = 'Unauthorized exception') {
    super(
      { message, error: 'Unauthorized exception' },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
