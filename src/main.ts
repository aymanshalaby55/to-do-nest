import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  // Get cache manager
  const cacheManager = app.get(CACHE_MANAGER);

  try {
    await cacheManager.set('startup', 'test');
    const value = await cacheManager.get('startup');
    console.log(
      'Redis Connection Status:',
      value === 'test' ? 'Connected' : 'Failed',
    );
  } catch (error) {
    console.error('Redis Connection Error:', error);
  }

  await app.listen(3333);
}
bootstrap();
