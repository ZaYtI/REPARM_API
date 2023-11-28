import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Request,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { Roles } from './roles/roles.decorator';
import { RoleGuard } from './role/role.guard';
import { AuthGuard } from './auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login' })
  @Post('login')
  async signIn(@Body() signInDto: LoginDto) {
    return this.authService.login(signInDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register' })
  @Post('register')
  async register(@Body() registerDto: CreateUserDto) {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'getProfile' })
  @Roles('user')
  @UseGuards(RoleGuard, AuthGuard)
  @Get('profile')
  async profile(@Request() req: Request & { user: any }) {
    return await this.userService.findOneByEmail({ email: req.user.email });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'logout' })
  @Roles('user')
  @UseGuards(RoleGuard)
  @Post('logout')
  async logout(@Request() req: Request & { user: any }) {
    const user = await this.userService.findOneByEmail({
      email: req.user.email,
    });
    const token = req.headers['authorization'].split(' ')[1];

    return this.authService.logout(user.id, token);
  }
}
