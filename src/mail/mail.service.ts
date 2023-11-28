import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserPasswordFromNaturaBuyOrder(email: string, password: string) {
    return this.mailerService.sendMail({
      to: email,
      subject: 'NaturaBuy - Votre commande',
      template: './confirmation',
      context: {
        password,
      },
    });
  }
}
