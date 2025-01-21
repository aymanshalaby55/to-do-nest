import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { Keyv } from 'keyv';
import { CacheableMemory } from 'cacheable';
import { TaskModule } from './task/task.module';
import { ListModule } from './list/list.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: new Keyv({
          store: new CacheableMemory({
            ttl: configService.get<number>('CACHE_TTL'),
            lruSize: 5000,
          }),
        }),
        redis: new KeyvRedis(configService.get<string>('REDIS_SERVER')),
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '7d',
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TaskModule,
    ListModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
