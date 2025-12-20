import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    const frontendUrl = process.env.FRONTEND_URL;
    
    app.enableCors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
          return callback(null, true);
        }
        
        // If FRONTEND_URL is set, only allow that origin
        if (frontendUrl) {
          return callback(null, origin === frontendUrl);
        }
        
        // In development, allow any localhost origin
        if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
          return callback(null, true);
        }
        
        // Default: allow common development ports
        const allowedOrigins = [
          'http://localhost:5173',
          'http://localhost:5174',
          'http://127.0.0.1:5173',
          'http://127.0.0.1:5174',
        ];
        
        callback(null, allowedOrigins.includes(origin));
      },
      credentials: true,
    });

    // Enable validation
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    // Set global prefix
    app.setGlobalPrefix('api');

    const port = process.env.PORT || 3000;
    await app.listen(port);
    
    console.log(`🚀 Application is running on: http://localhost:${port}/api`);
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    process.exit(1);
  }
}

bootstrap();


