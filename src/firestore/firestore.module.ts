// src/firestore/firestore.module.ts
import { Module } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [LoggingModule],
  providers: [
    {
      provide: 'FIREBASE_APP',
      useFactory: (configService: ConfigService) => {
        if (!admin.apps.length) {
          const serviceAccountPath = configService.get<string>('FIREBASE_SERVICE_ACCOUNT_PATH');
          if (!serviceAccountPath) {
            throw new Error('FIREBASE_SERVICE_ACCOUNT_PATH is not defined in environment variables');
          }
          try {
            const serviceAccount = require(serviceAccountPath);
            return admin.initializeApp({
              credential: admin.credential.cert(serviceAccount)
            });
          } catch (error) {
            throw new Error(`Failed to initialize Firebase: ${error.message}`);
          }
        }
        return admin.app();
      },
      inject: [ConfigService],
    },
    FirestoreService,
  ],
  exports: [FirestoreService],
})

export class FirestoreModule {}