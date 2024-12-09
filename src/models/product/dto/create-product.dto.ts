import {IProduct} from '@models/product/entity/product.interface';

export type CreateProductDto = Omit<IProduct, 'id' | 'createdAt' | 'updatedAt'>;
