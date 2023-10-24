import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommandeInterface } from './interface/commande.interface';

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

  async getCommandeById(commandeId: number): Promise<CommandeInterface> {
    const commande = await this.prismaService.commande.findUnique({
      where: {
        id: commandeId,
      },
    });
    return {
      id: commande.id,
      userId: commande.userId,
      isValidate: commande.IsValidate,
      createdAt: commande.createdAt,
      updatedAt: commande.updatedAt,
    };
  }

  async deleteCommande(commandeId: number): Promise<any | null> {
    return this.prismaService.commande.delete({
      where: {
        id: commandeId,
      },
    });
  }

  async getCommandeByUserId(userId: number): Promise<CommandeInterface[]> {
    const commandes = await this.prismaService.commande.findMany({
      where: {
        user: {
          id: userId,
        },
      },
    });
    return commandes.map((commande) => ({
      id: commande.id,
      userId: commande.userId,
      isValidate: commande.IsValidate,
      createdAt: commande.createdAt,
      updatedAt: commande.updatedAt,
    }));
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
