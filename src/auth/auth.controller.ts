import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Res,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from './auth.guard';
import { Response } from 'express';
import { CookiesInterceptor } from 'src/common/cookies.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() data: SignupDto, @Res() res: Response) {
    try {
      const result = await this.authService.signup(data);
      return res.status(201).json(result);
    } catch (error) {
      throw error; // Let NestJS handle the exception
    }
  }
  @Post('login')
  @UseInterceptors(CookiesInterceptor)
  async login(@Body() data: LoginDto) {
    try {
      const { access_token } = await this.authService.login(data);
      return access_token;
    } catch (error) {
      throw error; // Let NestJS handle the exception
    }
  }

  @UseGuards(JwtGuard)
  @Get('user/:id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return this.authService.getUser(+id);
  }
}
