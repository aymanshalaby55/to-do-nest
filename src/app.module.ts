import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { TaskModule } from './task/task.module';
import { ListModule } from './list/list.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    TaskModule,
    ListModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
