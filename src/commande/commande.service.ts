import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommandeService {
  constructor(private readonly prismaService: PrismaService) {}

  async createCommande(userId: number): Promise<any | null> {
    return this.prismaService.commande.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async getCommandeById(commandeId: number): Promise<any | null> {
    return this.prismaService.commande.findUnique({
      where: {
        id: commandeId,
      },
    });
  }

  async deleteCommande(commandeId: number): Promise<any | null> {
    return this.prismaService.commande.delete({
      where: {
        id: commandeId,
      },
    });
  }

  async getCommandeByUserId(userId: number): Promise<any | null> {
    return this.prismaService.commande.findMany({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async updateValidationCommande(
    commandeId: number,
    userId: number,
  ): Promise<any | null> {
    return this.prismaService.commande.update({
      where: {
        id: commandeId,
        user: {
          id: userId,
        },
      },
      data: {
        IsValidate: true,
      },
    });
  }
}
