// src/firestore/firestore.module.ts
import { Module } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [LoggingModule],
  providers: [FirestoreService],
  exports: [FirestoreService],
})
export class FirestoreModule {
  constructor(private configService: ConfigService) {
    if (!admin.apps.length) {
      const serviceAccountPath = this.configService.get<string>('FIREBASE_SERVICE_ACCOUNT_PATH');
      if (!serviceAccountPath) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_PATH is not defined in environment variables');
      }
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
      });
    }
  }
}