import { Module } from '@nestjs/common';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { PrismaService } from '../prisma.service';
import { TaskService } from '../task/task.service';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';

@Module({
  controllers: [ListController],
  providers: [ListService, PrismaService, TaskService, JwtStrategy],
})
export class ListModule {}
