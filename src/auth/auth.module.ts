import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtGuard } from './auth.guard';
import { PrismaService } from 'src/prisma.service';
import { JwtStrategy } from './strategy/jwt.strategy';
@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, JwtGuard, PrismaService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
