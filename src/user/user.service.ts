import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import * as generator from 'generate-password';

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
  }) {
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

  async findOneByEmail(params: { email: string }): Promise<User> {
    const { email } = params;
    return this.prismaService.user.findUnique({
      where: { email },
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

  async deleteUser(user_id: number): Promise<User> {
    return this.prismaService.user.delete({
      where: {
        id: user_id,
      },
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

  async getUserPanier(userId: number) {
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

  async generateRandomPassword(): Promise<string> {
    const password = generator.generate({
      length: 10,
      numbers: true,
      uppercase: true,
      lowercase: true,
      symbols: true,
    });
    return password;
  }

  async findRoleUser(userId: number) {
    const role = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });
    return role;
  }
}
