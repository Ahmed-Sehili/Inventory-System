import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto, UpdateProductResponseDto } from './dto/update-product.dto';
import { ProductResponseDto, DeleteProductResponseDto } from './dto/product-response.dto';
import { QueryProductDto, PaginatedProductsResponseDto, SortOrder } from './dto/query-product.dto';

/**
 * Controller for managing inventory products
 * Provides endpoints for creating, reading, updating, and deleting products
 */
@ApiTags('products')
@ApiBearerAuth('JWT-auth')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Create a new product in the inventory
   * @param createProductDto Product data to create
   * @returns Newly created product with ID
   */
  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Create a new product',
    description: 'Add a new product to the inventory with name, description, price, stock, and category'
  })
  @ApiResponse({
    status: 201,
    description: 'Product successfully created',
    type: ProductResponseDto,
    schema: {
      example: {
        id: 'abc123xyz456',
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 9999,
        stock: 100,
        category: 'Electronics'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid input data - validation errors with request body' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 500, description: 'Internal server error - database operation failed' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  /**
   * Get a paginated list of products with optional filtering and sorting
   * @param query Query parameters for pagination, filtering, and sorting
   * @returns Paginated list of products
   */
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    summary: 'Get products with pagination and filtering',
    description: `Retrieve a paginated list of products with optional filtering and sorting.
    
Example requests:
- /products?page=2&limit=20 - Get second page with 20 items per page
- /products?name=headphone - Search by name (case-insensitive, partial match)
- /products?category=Electronics - Filter by category
- /products?minPrice=1000&maxPrice=5000 - Filter by price range
- /products?sortBy=price&sortOrder=desc - Sort by price in descending order`
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of products retrieved successfully',
    type: PaginatedProductsResponseDto,
    schema: {
      example: {
        items: [
          {
            id: 'abc123xyz456',
            name: 'Wireless Headphones',
            description: 'High-quality wireless headphones with noise cancellation',
            price: 9999,
            stock: 100,
            category: 'Electronics'
          },
          {
            id: 'def456uvw789',
            name: 'Bluetooth Speaker',
            description: 'Portable Bluetooth speaker with 20-hour battery life',
            price: 7999,
            stock: 50,
            category: 'Electronics'
          }
        ],
        total: 42,
        page: 1,
        limit: 10,
        totalPages: 5,
        hasNextPage: true,
        hasPreviousPage: false
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid query parameters' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 500, description: 'Internal server error - database operation failed' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (starts from 1)', type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', type: Number, example: 10 })
  @ApiQuery({ name: 'name', required: false, description: 'Filter by product name (case-insensitive, partial match)', type: String, example: 'headphone' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category', type: String, example: 'Electronics', enum: ['Electronics', 'Clothing', 'Books', 'Furniture', 'Sports', 'Beauty', 'Home & Kitchen', 'Health & Beauty', 'Toys', 'Others'] })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimum price filter (inclusive)', type: Number, example: 1000 })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maximum price filter (inclusive)', type: Number, example: 5000 })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort by field', type: String, example: 'price', enum: ['name', 'price', 'stock', 'category'] })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order (asc or desc)', enum: SortOrder, example: SortOrder.DESC })
  findAll(@Query() query: QueryProductDto) {
    return this.productService.findAll(query);
  }

  /**
   * Get a product by its ID
   * @param id Product ID
   * @returns Product details
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get a product by ID',
    description: 'Retrieve a specific product by its ID'
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: 'abc123xyz456',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    type: ProductResponseDto,
    schema: {
      example: {
        id: 'abc123xyz456',
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 9999,
        stock: 100,
        category: 'Electronics'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 404, description: 'Product not found - No product exists with the specified ID' })
  @ApiResponse({ status: 500, description: 'Internal server error - database operation failed' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  /**
   * Update an existing product
   * @param id Product ID
   * @param updateProductDto Updated product data
   * @returns Updated product
   */
  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, skipMissingProperties: true }))
  @ApiOperation({
    summary: 'Update a product',
    description: 'Update an existing product by its ID. Only the provided fields will be updated.'
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: 'abc123xyz456',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: UpdateProductResponseDto,
    schema: {
      example: {
        id: 'abc123xyz456',
        name: 'Updated Wireless Headphones',
        description: 'Updated high-quality wireless headphones with noise cancellation',
        price: 8999,
        stock: 150,
        category: 'Electronics'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid input data - validation errors with request body' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 404, description: 'Product not found - No product exists with the specified ID' })
  @ApiResponse({ status: 500, description: 'Internal server error - database operation failed' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  /**
   * Delete a product from the inventory
   * @param id Product ID
   * @returns Deletion confirmation
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a product',
    description: 'Remove a product from the inventory by its ID'
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: 'abc123xyz456',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
    type: DeleteProductResponseDto,
    schema: {
      example: {
        id: 'abc123xyz456',
        deleted: true
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 404, description: 'Product not found - No product exists with the specified ID' })
  @ApiResponse({ status: 500, description: 'Internal server error - database operation failed' })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
