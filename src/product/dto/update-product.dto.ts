import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

// Using PartialType from @nestjs/swagger instead of @nestjs/mapped-types
// to ensure proper Swagger documentation inheritance
import { PartialType as SwaggerPartialType } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {}

// This class is used only for Swagger documentation
export class UpdateProductResponseDto {
  @ApiProperty({
    description: 'Product ID',
    example: 'abc123xyz456',
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Updated Wireless Headphones',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Updated high-quality wireless headphones with noise cancellation',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Product price in cents',
    example: 8999,
    required: false,
  })
  price?: number;

  @ApiProperty({
    description: 'Available stock quantity',
    example: 150,
    required: false,
  })
  stock?: number;

  @ApiProperty({
    description: 'Product category',
    example: 'Electronics',
    enum: ['Electronics', 'Clothing', 'Books', 'Furniture', 'Sports', 'Beauty', 'Home & Kitchen', 'Health & Beauty', 'Toys', 'Others'],
    required: false,
  })
  category?: string;
}
