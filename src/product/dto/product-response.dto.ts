import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    description: 'Product ID',
    example: 'abc123xyz456',
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Wireless Headphones',
  })
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'High-quality wireless headphones with noise cancellation',
  })
  description: string;

  @ApiProperty({
    description: 'Product price in cents',
    example: 9999,
  })
  price: number;

  @ApiProperty({
    description: 'Available stock quantity',
    example: 100,
  })
  stock: number;

  @ApiProperty({
    description: 'Product category',
    example: 'Electronics',
    enum: ['Electronics', 'Clothing', 'Books', 'Furniture', 'Sports', 'Beauty', 'Home & Kitchen', 'Health & Beauty', 'Toys', 'Others'],
  })
  category: string;
}

export class DeleteProductResponseDto {
  @ApiProperty({
    description: 'Product ID that was deleted',
    example: 'abc123xyz456',
  })
  id: string;

  @ApiProperty({
    description: 'Deletion status',
    example: true,
  })
  deleted: boolean;
}
