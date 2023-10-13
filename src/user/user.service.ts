import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from 'src/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<any[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select: {
        id: true,
        name: true,
        email: true,
        role: {
          select: {
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOneByEmail(params: { email: string }): Promise<any> {
    const { email } = params;
    return this.prismaService.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: {
          select: {
            name: true,
          },
        },
        panier: {
          select: {
            id: true,
          },
        },
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, name, password } = createUserDto;
    const salt = await bcrypt.genSalt();
    const cryptedPassword = await bcrypt.hash(password, salt);
    return this.prismaService.user.create({
      data: {
        email,
        name,
        password: cryptedPassword,
        role: {
          connect: {
            id: 1,
          },
        },
      },
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prismaService.user.delete({
      where,
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prismaService.user.update({
      data,
      where,
    });
  }

  async getUserPanier(userId: number): Promise<any> {
    const panier = await this.prismaService.panier.findUnique({
      where: {
        userId,
      },
    });
    if (!panier) {
      const newPanier = await this.prismaService.panier.create({
        data: {
          userId,
        },
      });
      return newPanier;
    }
    return panier;
  }

  async getUserPanierItems(userId: number): Promise<any> {
    const panier = await this.getUserPanier(userId);
    return this.prismaService.panierProduit.findMany({
      where: {
        panierId: panier.id,
      },
      include: {
        produit: true,
      },
    });
  }
}
