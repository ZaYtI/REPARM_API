import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CronService {
  constructor(private readonly authService: AuthService) {}

  @Cron('0 */1 * * * *')
  async handleCron() {
    console.log('Cron job started');
    await this.authService.deleteExpiredRefreshTokens();
    console.log('Cron job finished');
  }
}
