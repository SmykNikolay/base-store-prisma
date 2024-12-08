export interface IProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
  color: string;
  material: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateProductDto = Omit<IProduct, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProductDto = Partial<CreateProductDto>;