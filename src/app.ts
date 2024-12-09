import 'reflect-metadata';
import express, { Express } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { errorHandler } from './middleware/error.middleware';
import {  initializeDatabase } from './lib/data-source';
import { productRouter } from '@routes/product.routes';


config();

class App {
  private readonly _app: Express;
  private readonly _port: number;

  constructor() {
    this._app = express();
    this._port = Number(process.env.PORT) || 3000;
    this._initializeMiddlewares();
    this._initializeRoutes();
    this._initializeErrorHandling();
  }

  private _initializeMiddlewares(): void {
    this._app.use(express.json());
    this._app.use(cors());
  }

  private _initializeRoutes(): void {
    this._app.use('/api/products', productRouter);
  }

  private _initializeErrorHandling(): void {
    this._app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      await initializeDatabase();

      this._app.listen(this._port, () => {
        console.log(`Сервер запущен на порту ${this._port}`);
      });
    } catch (error) {
      console.error('Ошибка при запуске приложения:', error);
      process.exit(1);
    }
  }
}

const app = new App();
app.start();