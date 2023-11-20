import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.findOne({ id: Number(id) });
  }

  @Get('/all')
  async getAllUsers() {
    try {
      return this.userService.findAll({});
    } catch (err) {
      return response.status(err.status).json(err.message);
    }
  }
}
