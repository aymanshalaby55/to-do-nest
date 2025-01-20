import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() data: SignupDto) {
    const users = this.authService.signup(data);
    return users;
  }

  @Post('login')
  signin(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @UseGuards(JwtGuard)
  @Get('user')
  getuser(@Param('id') id: number) {
    return this.authService.getUser(id);
  }
}
