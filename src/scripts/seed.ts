import 'reflect-metadata';
import { faker } from '@faker-js/faker/locale/ru';
import { config } from 'dotenv';
import { initializeDatabase } from '../lib/data-source';
import { productRepository } from '@models/product/repository/product.repository';
import { CreateProductDto } from '@/models/product/dto/create-product.dto';

config();


const generateProducts = (count: number): CreateProductDto[] => {
  return Array.from({ length: count }, () => ({
    title: faker.commerce.productName(),
    price: parseFloat(faker.commerce.price({ min: 100, max: 10000 })),
    description: faker.commerce.productDescription(),
    images: [faker.image.urlPicsumPhotos({ width: 640, height: 480 })],
    color: faker.commerce.productMaterial(), // Добавляем цвет
    material: faker.commerce.productMaterial(), // Добавляем материал
  }));
};

const seedDatabase = async (count: number = 50) => {
  try {
    console.log('Подключение к базе данных...');
    await initializeDatabase();

    console.log(`Генерация ${count} продуктов...`);
    const products = generateProducts(count);

    console.log('Сохранение продуктов в базу данных...');
    for (const product of products) {
      await productRepository.create(product);
    }

    console.log('✅ Данные успешно добавлены в базу данных');
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка при заполнении базы данных:', error);
    process.exit(1);
  }
};

seedDatabase();