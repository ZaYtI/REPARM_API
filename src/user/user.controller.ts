import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles/roles.decorator';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @Roles('admin')
  async getUserById(@Param('id') id: string) {
    return this.userService.findOne({ id: Number(id) });
  }

  @Get('/all')
  @Roles('admin')
  async getAllUsers() {
    try {
      return this.userService.findAll({});
    } catch (err) {
      return response.status(err.status).json(err.message);
    }
  }
}
