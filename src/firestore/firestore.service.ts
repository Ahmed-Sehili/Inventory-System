// src/firestore/firestore.service.ts
import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { SortOrder } from 'src/product/dto/query-product.dto';
import { LoggingService } from 'src/logging/logging.service';

/**
 * Service for interacting with Firestore database
 * Provides methods for CRUD operations and advanced querying
 */
@Injectable()
export class FirestoreService {
  private db: admin.firestore.Firestore;

  constructor(private logger: LoggingService) {
    this.db = admin.firestore();
    this.logger.setContext('FirestoreService');
  }

  /**
   * Get the Firestore database instance
   * @returns Firestore database instance
   */
  getDb() {
    return this.db;
  }

  /**
   * Get all documents from a collection
   * @param collection Collection name
   * @returns Array of documents with their IDs
   * @throws InternalServerErrorException if the database operation fails
   */
  async getCollection(collection: string): Promise<any[]> {
    try {
      this.logger.log(`Retrieving all documents from collection: ${collection}`, 'FirestoreService');
      const snapshot = await this.db.collection(collection).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      this.logger.error(
        `Failed to retrieve documents from collection ${collection}: ${error.message}`,
        error.stack,
        'FirestoreService'
      );
      throw new InternalServerErrorException(`Database error: ${error.message}`);
    }
  }
  
  /**
   * Get a collection with pagination and filtering
   * @param collection Collection name
   * @param options Pagination and filtering options
   * @returns Paginated results and total count
   * @throws BadRequestException if the query parameters are invalid
   * @throws InternalServerErrorException if the database operation fails
   */
  async getCollectionWithOptions(collection: string, options: {
    page?: number;
    limit?: number;
    filters?: Record<string, any>;
    sortBy?: string;
    sortOrder?: SortOrder;
  }): Promise<{ items: any[]; total: number }> {
    try {
      const {
        page = 1,
        limit = 10,
        filters = {},
        sortBy = 'name',
        sortOrder = SortOrder.ASC,
      } = options;
      
      this.logger.log(
        `Retrieving documents from ${collection} with options: ${JSON.stringify({ page, limit, filters, sortBy, sortOrder })}`,
        'FirestoreService'
      );
      
      // Validate pagination parameters
      if (page < 1 || limit < 1 || limit > 100) {
        throw new BadRequestException('Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 100.');
      }
      
      // Start with the base query
      let query: admin.firestore.Query = this.db.collection(collection);
      
      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Handle special filter cases
          if (key === 'name' && typeof value === 'string') {
            // For name, use a case-insensitive contains query
            const lowerCaseValue = value.toLowerCase();
            query = query.where('nameSearch', '>=', lowerCaseValue)
                         .where('nameSearch', '<=', lowerCaseValue + '\uf8ff');
          } else if (key === 'minPrice' && typeof value === 'number') {
            query = query.where('price', '>=', value);
          } else if (key === 'maxPrice' && typeof value === 'number') {
            query = query.where('price', '<=', value);
          } else {
            // Standard equality filter
            query = query.where(key, '==', value);
          }
        }
      });
      
      // Get total count for pagination
      const countSnapshot = await query.get();
      const total = countSnapshot.size;
      
      // Apply sorting
      if (sortBy) {
        query = query.orderBy(sortBy, sortOrder === SortOrder.DESC ? 'desc' : 'asc');
      }
      
      // Apply pagination
      const offset = (page - 1) * limit;
      query = query.limit(limit);
      
      if (offset > 0) {
        query = query.offset(offset);
      }
      
      // Execute query
      const snapshot = await query.get();
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      this.logger.log(
        `Retrieved ${items.length} documents from ${collection} (page ${page}, total: ${total})`,
        'FirestoreService'
      );
      
      return { items, total };
    } catch (error) {
      // Don't wrap BadRequestException
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      this.logger.error(
        `Failed to retrieve documents from ${collection} with options: ${error.message}`,
        error.stack,
        'FirestoreService'
      );
      
      throw new InternalServerErrorException(`Database query error: ${error.message}`);
    }
  }

  /**
   * Add a new document to a collection
   * @param collection Collection name
   * @param data Document data
   * @returns ID of the created document
   * @throws InternalServerErrorException if the database operation fails
   */
  async addDocument(collection: string, data: any): Promise<string> {
    try {
      this.logger.log(`Adding document to collection: ${collection}`, 'FirestoreService');
      const docRef = await this.db.collection(collection).add(data);
      this.logger.log(`Document added with ID: ${docRef.id}`, 'FirestoreService');
      return docRef.id;
    } catch (error) {
      this.logger.error(
        `Failed to add document to collection ${collection}: ${error.message}`,
        error.stack,
        'FirestoreService'
      );
      throw new InternalServerErrorException(`Database error: ${error.message}`);
    }
  }

  /**
   * Get a document by ID
   * @param collection Collection name
   * @param id Document ID
   * @returns Document data with ID or null if not found
   * @throws InternalServerErrorException if the database operation fails
   */
  async getDocument(collection: string, id: string): Promise<any> {
    try {
      this.logger.log(`Retrieving document ${id} from collection: ${collection}`, 'FirestoreService');
      const doc = await this.db.collection(collection).doc(id).get();
      
      if (!doc.exists) {
        this.logger.warn(`Document ${id} not found in collection ${collection}`, 'FirestoreService');
        return null;
      }
      
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      this.logger.error(
        `Failed to retrieve document ${id} from collection ${collection}: ${error.message}`,
        error.stack,
        'FirestoreService'
      );
      throw new InternalServerErrorException(`Database error: ${error.message}`);
    }
  }

  /**
   * Update a document by ID
   * @param collection Collection name
   * @param id Document ID
   * @param data Updated document data
   * @throws NotFoundException if the document doesn't exist
   * @throws InternalServerErrorException if the database operation fails
   */
  async updateDocument(collection: string, id: string, data: any): Promise<void> {
    try {
      this.logger.log(`Updating document ${id} in collection: ${collection}`, 'FirestoreService');
      
      // Check if document exists first
      const docSnapshot = await this.db.collection(collection).doc(id).get();
      if (!docSnapshot.exists) {
        this.logger.warn(`Document ${id} not found in collection ${collection} for update`, 'FirestoreService');
        throw new NotFoundException(`Document with ID ${id} not found in collection ${collection}`);
      }
      
      await this.db.collection(collection).doc(id).update(data);
      this.logger.log(`Document ${id} updated successfully`, 'FirestoreService');
    } catch (error) {
      // Don't wrap NotFoundException
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      this.logger.error(
        `Failed to update document ${id} in collection ${collection}: ${error.message}`,
        error.stack,
        'FirestoreService'
      );
      throw new InternalServerErrorException(`Database error: ${error.message}`);
    }
  }

  /**
   * Delete a document by ID
   * @param collection Collection name
   * @param id Document ID
   * @throws NotFoundException if the document doesn't exist
   * @throws InternalServerErrorException if the database operation fails
   */
  async deleteDocument(collection: string, id: string): Promise<void> {
    try {
      this.logger.log(`Deleting document ${id} from collection: ${collection}`, 'FirestoreService');
      
      // Check if document exists first
      const docSnapshot = await this.db.collection(collection).doc(id).get();
      if (!docSnapshot.exists) {
        this.logger.warn(`Document ${id} not found in collection ${collection} for deletion`, 'FirestoreService');
        throw new NotFoundException(`Document with ID ${id} not found in collection ${collection}`);
      }
      
      await this.db.collection(collection).doc(id).delete();
      this.logger.log(`Document ${id} deleted successfully`, 'FirestoreService');
    } catch (error) {
      // Don't wrap NotFoundException
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      this.logger.error(
        `Failed to delete document ${id} from collection ${collection}: ${error.message}`,
        error.stack,
        'FirestoreService'
      );
      throw new InternalServerErrorException(`Database error: ${error.message}`);
    }
  }
}