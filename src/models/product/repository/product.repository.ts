import { Repository, DeleteResult, QueryRunner } from 'typeorm';
import { AppDataSource } from 'lib/data-source';

import { Product } from '@models/product/entity/product.entity';
import { UpdateProductDto } from '@models/product/dto/update-product.dto'
import { CreateProductDto } from '@models/product/dto/create-product.dto';

export class ProductRepository {
  private static _instance: ProductRepository;
  private readonly _repository: Repository<Product>;

  private constructor() {
    this._repository = AppDataSource.getRepository(Product);
  }

  public static getInstance(): ProductRepository {
    if (!ProductRepository._instance) {
      ProductRepository._instance = new ProductRepository();
    }
    return ProductRepository._instance;
  }

  private async _withTransaction<T>(
    operation: (queryRunner: QueryRunner) => Promise<T>
  ): Promise<T> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await operation(queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw this._handleError(error);
    } finally {
      await queryRunner.release();
    }
  }

  private _handleError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error('Произошла неизвестная ошибка');
  }

  async findAll(): Promise<Product[]> {
    return this._repository.find();
  }

  async findById(id: number): Promise<Product | null> {
    if (!id || id <= 0) {
      throw new Error('Некорректный ID продукта');
    }
    return this._repository.findOneBy({ id });
  }

  async create(productData: CreateProductDto): Promise<Product> {
    return this._withTransaction(async (queryRunner) => {
      const product = this._repository.create(productData);
      return await queryRunner.manager.save(product);
    });
  }

  async update(id: number, productData: UpdateProductDto): Promise<Product> {
    return this._withTransaction(async () => {
      const product = await this.findById(id);
      if (!product) {
        throw new Error(`Продукт с id ${id} не найден`);
      }
      const updatedProduct = this._repository.merge(product, productData);
      return await this._repository.save(updatedProduct);
    });
  }

  async delete(id: number): Promise<DeleteResult> {
    return this._withTransaction(async (queryRunner) => {
      const result = await queryRunner.manager.delete(Product, id);
      if (result.affected === 0) {
        throw new Error(`Продукт с id ${id} не найден`);
      }
      return result;
    });
  }
}

export const productRepository = ProductRepository.getInstance();