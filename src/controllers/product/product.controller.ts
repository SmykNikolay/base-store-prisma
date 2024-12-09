
import { Request, Response } from 'express';
import { CreateProductDto } from '@models/product/dto/create-product.dto';
import { UpdateProductDto } from '@models/product/dto/update-product.dto';
import { productRepository } from '@models/product/repository/product.repository';

export class ProductController {
  private static _instance: ProductController;

  private constructor() {}

  public static getInstance(): ProductController {
    if (!ProductController._instance) {
      ProductController._instance = new ProductController();
    }
    return ProductController._instance;
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const products = await productRepository.findAll();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при получении продуктов' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const product = await productRepository.findById(id);

      if (!product) {
        res.status(404).json({ message: `Продукт с id ${id} не найден` });
        return;
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при получении продукта' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const productData: CreateProductDto = req.body;
      const newProduct = await productRepository.create(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при создании продукта' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const productData: UpdateProductDto = req.body;
      const updatedProduct = await productRepository.update(id, productData);
      res.json(updatedProduct);
    } catch (error) {
      if (error instanceof Error && error.message.includes('не найден')) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Ошибка при обновлении продукта' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      await productRepository.delete(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message.includes('не найден')) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Ошибка при удалении продукта' });
    }
  }
}

export const productController = ProductController.getInstance();