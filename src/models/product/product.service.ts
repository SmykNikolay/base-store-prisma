
import { prisma } from 'lib/prisma';
import { CreateProductDto, IProduct, UpdateProductDto } from './product.interface';


export class ProductService {
  private static _instance: ProductService;
  private constructor() {}

  public static getInstance(): ProductService {
    if (!this._instance) {
      this._instance = new ProductService();
    }
    return this._instance;
  }

  async create(data: CreateProductDto): Promise<IProduct> {
    return prisma.product.create({ data });
  }

  async findAll(): Promise<IProduct[]> {
    return prisma.product.findMany();
  }

  async findById(id: number): Promise<IProduct | null> {
    return prisma.product.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateProductDto): Promise<IProduct> {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<IProduct> {
    return prisma.product.delete({ where: { id } });
  }
}

export const productService = ProductService.getInstance();