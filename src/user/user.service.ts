import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
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

  async findOneById(id: number): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
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
    console.log(email);
    return this.prismaService.user.findUnique({
      where: { email },
      select: {
        id: true,
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

  async createUser(data: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(data.password, salt);
    const { ...rest } = data;
    return this.prismaService.user.create({
      data: {
        ...rest,
        password: hash,
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
}
