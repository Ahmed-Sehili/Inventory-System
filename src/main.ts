import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { GlobalAuthGuard } from './auth/guards/global-auth.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpFilterFilter } from './http-filter/http-filter.filter';
import { LoggingService } from './logging/logging.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Apply global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));
  
  // Apply global authentication guard
  const reflector = app.get(Reflector);
  const jwtAuthGuard = app.get(JwtAuthGuard);
  app.useGlobalGuards(new GlobalAuthGuard(jwtAuthGuard, reflector));
  
  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Inventory Management System API')
    .setDescription(`
      ## Inventory Management System API Documentation
      
      This API provides endpoints for managing inventory products and user authentication.
      
      ### Key Features
      - **Authentication**: Secure JWT-based authentication system
      - **Product Management**: CRUD operations for inventory products
      - **Pagination**: Support for paginated product listings
      - **Search & Filtering**: Advanced search and filtering capabilities
      - **Sorting**: Flexible sorting options for product listings
      
      ### Authentication
      All endpoints except for login require authentication via JWT token.
      To authenticate, first obtain a token via the /auth/login endpoint, then use it in the Authorization header.
    `)
    .setVersion('1.0')
    .setContact('Support Team', 'https://example.com/support', 'support@example.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3000', 'Local Development Server')
    .addServer('https://api.example.com', 'Production Server')
    .addTag('auth', 'Authentication endpoints for user login and token management')
    .addTag('products', 'Product management endpoints for inventory control')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  
  // Add custom CSS to improve Swagger UI appearance
  const customCss = `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { font-size: 32px }
    .swagger-ui .info .description { font-size: 16px }
    .swagger-ui .opblock-tag { font-size: 20px }
  `;
  
  SwaggerModule.setup('docs', app, document, {
    customCss,
    customSiteTitle: 'Inventory System API Docs',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      deepLinking: true,
    },
  });
  
  // Enable CORS
  app.enableCors();
  
  // Apply global exception filter
  const logger = app.get(LoggingService);
  app.useGlobalFilters(new HttpFilterFilter(logger));
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
