import express, { Express } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { errorHandler } from './middleware/error.middleware';
import { prisma } from './lib/prisma';


config();

class App {
  private _app: Express;
  private _port: number;

  constructor() {
    this._app = express();
    this._port = Number(process.env.PORT) || 3000;
    this._initializeMiddlewares();
    this._initializeErrorHandling();
  }

  private _initializeMiddlewares(): void {
    this._app.use(express.json());
    this._app.use(cors());
  }

  private _initializeErrorHandling(): void {
    this._app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      await prisma.$connect();
      console.log('Database connection established');

      this._app.listen(this._port, () => {
        console.log(`Server is running on port ${this._port}`);
      });
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      process.exit(1);
    }
  }
}

const app = new App();
app.start();