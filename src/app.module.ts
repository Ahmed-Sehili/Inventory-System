import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { FirestoreModule } from './firestore/firestore.module';
import { AuthModule } from './auth/auth.module';
import { LoggingModule } from './logging/logging.module';
import { LoggingMiddleware } from './logging/logging.middleware';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [ProductModule, FirestoreModule, AuthModule, LoggingModule, ConfigModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply logging middleware to all routes
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
