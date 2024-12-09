import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.NODE_ENV === 'test' ? ':memory:' : 'src/database/app.sqlite',
  entities: ['src/models/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false, // отключаем в production
  logging: process.env.NODE_ENV === 'development',
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('База данных успешно инициализирована');
  } catch (error) {
    console.error('Ошибка при инициализации базы данных:', error);
    process.exit(1);
  }
};