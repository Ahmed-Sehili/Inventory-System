import { IsString, IsInt, IsNotEmpty, IsPositive, MinLength, MaxLength, IsEnum, IsOptional, Min, Max } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto {
  // This field is used internally for search functionality and is not exposed to API users
  nameSearch?: string;
  @ApiProperty({
    description: 'Product name',
    example: 'Wireless Headphones',
    minLength: 3,
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'High-quality wireless headphones with noise cancellation',
    minLength: 10,
    maxLength: 1000
  })
  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
  description: string;

  @ApiProperty({
    description: 'Product price in cents',
    example: 9999,
    minimum: 1,
    maximum: 1000000
  })
  @IsInt({ message: 'Price must be an integer' })
  @IsPositive({ message: 'Price must be a positive number' })
  @Max(1000000, { message: 'Price cannot exceed 1,000,000' })
  price: number;

  @ApiProperty({
    description: 'Available stock quantity',
    example: 100,
    minimum: 0,
    maximum: 10000
  })
  @IsInt({ message: 'Stock must be an integer' })
  @Min(0, { message: 'Stock cannot be negative' })
  @Max(10000, { message: 'Stock cannot exceed 10,000 units' })
  stock: number;

  @ApiProperty({
    description: 'Product category',
    example: 'Electronics',
    enum: ['Electronics', 'Clothing', 'Books', 'Furniture', 'Sports', 'Beauty', 'Home & Kitchen', 'Health & Beauty', 'Toys', 'Others']
  })
  @IsEnum(['Electronics', 'Clothing', 'Books', 'Furniture', 'Sports', 'Beauty', 'Home & Kitchen', 'Health & Beauty', 'Toys', 'Others'], { 
    message: 'Category must be one of: Electronics, Clothing, Books, Furniture, Sports, Beauty, Home & Kitchen, Health & Beauty, Toys, Others'
  })
  @IsNotEmpty({ message: 'Category is required' })
  category: string;
}
