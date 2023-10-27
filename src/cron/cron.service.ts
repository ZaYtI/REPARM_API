import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CronService {
  constructor(private readonly authService: AuthService) {}

  @Cron('0 */10 * * * *')
  async handleCron() {
    await this.authService.deleteExpiredRefreshTokens();
  }
}
