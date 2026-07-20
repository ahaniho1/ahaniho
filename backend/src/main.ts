import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://ahaniho.vercel.app'],
    credentials: true,
  });

  // Global prefix for all APIs
  app.setGlobalPrefix('api/v1');

  // Run seed on startup
  const seedService = app.get(SeedService);
  await seedService.seed();

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`🚀 Aha Secret Max Backend running on: http://localhost:${port}`);
  console.log(`📚 API Docs: http://localhost:${port}/api/v1`);
}
bootstrap();