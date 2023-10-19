import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/dto/login.dto';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: LoginDto) {
    return this.authService.login(signInDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() registerDto: CreateUserDto) {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  async profile(@Request() req: any) {
    return await this.userService.findOneByEmail({ email: req.body.email });
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Request() req: any) {
    const user = await this.userService.findOneByEmail({
      email: req.user.email,
    });
    const token = req.headers.authorization.split(' ')[1];

    return this.authService.logout(user.id, token);
  }
}
