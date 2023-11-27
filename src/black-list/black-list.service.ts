import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BlackListService {
  constructor(private readonly prismaService: PrismaService) {}

  async addTokenWithUserAndDate(
    token: string,
    userId: number,
    ExpirationToken: bigint,
  ): Promise<void> {
    await this.prismaService.blackList.create({
      data: {
        token: token,
        user: {
          connect: {
            id: userId,
          },
        },
        ExpirationToken,
      },
    });
  }

  async findToken(token: string): Promise<boolean> {
    const result = await this.prismaService.blackList.findFirst({
      where: {
        token: token,
      },
    });
    if (result) {
      return true;
    } else {
      return false;
    }
  }

  async isBlackListed(token: string): Promise<boolean> {
    const result = await this.prismaService.blackList.findFirst({
      where: {
        token: token,
      },
    });
    if (result) {
      return true;
    } else {
      return false;
    }
  }
}
