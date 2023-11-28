import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AuthService } from 'src/auth/auth.service';
import { BlackListService } from 'src/black-list/black-list.service';

@Injectable()
export class CronService {
  constructor(
    private readonly authService: AuthService,
    private readonly blackListService: BlackListService,
  ) {}

  @Cron('0 */10 * * * *')
  async handleCron() {
    await this.authService.deleteExpiredRefreshTokens();
    await this.blackListService.deleteExpiredRefreshTokens();
  }
}
