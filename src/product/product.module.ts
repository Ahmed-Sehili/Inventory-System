import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { FirestoreModule } from 'src/firestore/firestore.module';

@Module({
  imports: [FirestoreModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
