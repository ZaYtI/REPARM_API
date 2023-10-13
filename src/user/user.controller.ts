import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { response } from 'express';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.findOne({ id: Number(id) });
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAllUsers() {
    try {
      return this.userService.findAll({});
    } catch (err) {
      return response.status(err.status).json(err.message);
    }
  }

  @Post()
  async createUser(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<User> {
    const { name, email, password } = createUserDto;
    const role = { connect: { id: 1 } };
    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password,
        role,
      },
    });
    return user;
  }

  @Get(':id/panier')
  async getPanier(@Param('id') id: string) {
    return this.userService.getUserPanier(Number(id));
  }

  @Get(':id/panier_items')
  async getPanierItems(@Param('id') id: string) {
    return this.userService.getUserPanierItems(Number(id));
  }
}
