
import { PrismaClient } from '@prisma/client'

class PrismaService {
  private static _instance: PrismaClient;
  private static _isInitialized: boolean = false;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!this._isInitialized) {
      this._instance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });
      this._isInitialized = true;
    }
    return this._instance;
  }
}

export const prisma = PrismaService.getInstance();