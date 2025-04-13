import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsString, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Enum for sort order options
 * @enum {string}
 */

export enum SortOrder {
  /** Ascending order (A-Z, 0-9) */
  ASC = 'asc',
  /** Descending order (Z-A, 9-0) */
  DESC = 'desc',
}

/**
 * Data Transfer Object for product query parameters
 * Used for filtering, pagination, and sorting product listings
 */
export class QueryProductDto {
  @ApiPropertyOptional({
    description: 'Page number (starts from 1)',
    default: 1,
    minimum: 1,
    type: Number,
    example: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 10,
    minimum: 1,
    maximum: 100,
    type: Number,
    example: 10
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Search by product name (case-insensitive, partial match)',
    type: String,
    example: 'headphone'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by exact category match',
    type: String,
    example: 'Electronics',
    enum: ['Electronics', 'Clothing', 'Books', 'Furniture', 'Sports', 'Beauty', 'Home & Kitchen', 'Health & Beauty', 'Toys', 'Others']
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Minimum price filter (inclusive)',
    type: Number,
    minimum: 0,
    example: 1000
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum price filter (inclusive)',
    type: Number,
    minimum: 0,
    example: 5000
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Field to sort results by',
    default: 'name',
    type: String,
    example: 'price',
    enum: ['name', 'price', 'stock', 'category']
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'name';

  @ApiPropertyOptional({
    description: 'Sort order direction',
    default: SortOrder.ASC,
    enum: SortOrder,
    enumName: 'SortOrder',
    example: SortOrder.DESC
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.ASC;
}

/**
 * Data Transfer Object for paginated product response
 * Includes the product items and pagination metadata
 */
export class PaginatedProductsResponseDto {
  @ApiProperty({
    description: 'Array of products matching the query criteria',
    type: 'array',
    isArray: true
  })
  items: any[];

  @ApiProperty({
    description: 'Total number of products matching the query criteria',
    type: Number,
    example: 42
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    type: Number,
    example: 1,
    minimum: 1
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    type: Number,
    example: 10,
    minimum: 1
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages available',
    type: Number,
    example: 5,
    minimum: 0
  })
  totalPages: number;

  @ApiProperty({
    description: 'Whether there is a next page available',
    type: Boolean,
    example: true
  })
  hasNextPage: boolean;

  @ApiProperty({
    description: 'Whether there is a previous page available',
    type: Boolean,
    example: false
  })
  hasPreviousPage: boolean;
}
