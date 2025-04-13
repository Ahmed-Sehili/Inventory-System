import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FirestoreService } from 'src/firestore/firestore.service';
import { LoggingService } from 'src/logging/logging.service';
import { QueryProductDto, PaginatedProductsResponseDto } from './dto/query-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private firestoreService: FirestoreService,
    private logger: LoggingService
  ) {
    this.logger.setContext('ProductService');
  }

  async create(createProductDto: CreateProductDto) {
    this.logger.log(`Creating new product: ${createProductDto.name}`, 'ProductService');
    try {
      // Add a lowercase version of the name for case-insensitive search
      const dataWithSearchFields = {
        ...createProductDto,
        nameSearch: createProductDto.name.toLowerCase(),
      };
      
      const productId = await this.firestoreService.addDocument('products', dataWithSearchFields);
      this.logger.log(`Product created with ID: ${productId}`, 'ProductService');
      return { id: productId, ...createProductDto };
    } catch (error) {
      this.logger.error(`Failed to create product: ${error.message}`, error.stack, 'ProductService');
      throw error;
    }
  }

  async findAll(query: QueryProductDto): Promise<PaginatedProductsResponseDto> {
    this.logger.log(`Retrieving products with pagination and filters: ${JSON.stringify(query)}`, 'ProductService');
    try {
      // Extract pagination parameters
      const { page = 1, limit = 10, name, category, minPrice, maxPrice, sortBy, sortOrder } = query;
      
      // Build filters object
      const filters: Record<string, any> = {};
      if (name) filters.name = name;
      if (category) filters.category = category;
      if (minPrice !== undefined) filters.minPrice = minPrice;
      if (maxPrice !== undefined) filters.maxPrice = maxPrice;
      
      // Get paginated results
      const { items, total } = await this.firestoreService.getCollectionWithOptions('products', {
        page,
        limit,
        filters,
        sortBy,
        sortOrder,
      });
      
      // Calculate pagination metadata
      const totalPages = Math.ceil(total / limit);
      
      this.logger.log(`Retrieved ${items.length} products (page ${page} of ${totalPages})`, 'ProductService');
      
      // Return paginated response
      return {
        items,
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve products: ${error.message}`, error.stack, 'ProductService');
      throw error;
    }
  }

  async findOne(id: string) {
    this.logger.log(`Retrieving product with ID: ${id}`, 'ProductService');
    try {
      const product = await this.firestoreService.getDocument('products', id);
      if (!product) {
        this.logger.warn(`Product with ID ${id} not found`, 'ProductService');
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      this.logger.log(`Retrieved product: ${product.name}`, 'ProductService');
      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to retrieve product: ${error.message}`, error.stack, 'ProductService');
      throw error;
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    this.logger.log(`Updating product with ID: ${id}`, 'ProductService');
    try {
      const product = await this.firestoreService.getDocument('products', id);
      if (!product) {
        this.logger.warn(`Product with ID ${id} not found for update`, 'ProductService');
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      
      // Update search fields if name is being updated
      const dataToUpdate = { ...updateProductDto };
      if (updateProductDto.name) {
        dataToUpdate.nameSearch = updateProductDto.name.toLowerCase();
      }
      
      await this.firestoreService.updateDocument('products', id, dataToUpdate);
      this.logger.log(`Product ${id} updated successfully`, 'ProductService');
      
      // Return updated product with both existing and updated fields
      return { id, ...product, ...updateProductDto };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to update product: ${error.message}`, error.stack, 'ProductService');
      throw error;
    }
  }

  async remove(id: string) {
    this.logger.log(`Deleting product with ID: ${id}`, 'ProductService');
    try {
      const product = await this.firestoreService.getDocument('products', id);
      if (!product) {
        this.logger.warn(`Product with ID ${id} not found for deletion`, 'ProductService');
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      
      await this.firestoreService.deleteDocument('products', id);
      this.logger.log(`Product ${id} deleted successfully`, 'ProductService');
      return { id, deleted: true };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to delete product: ${error.message}`, error.stack, 'ProductService');
      throw error;
    }
  }
}
