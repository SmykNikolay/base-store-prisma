// src/routes/product.routes.ts
import { Router } from 'express';
import { body, param } from 'express-validator';

import { productController } from '@/controllers/product/product.controller';
import { validateRequest } from 'middleware/validate-request.middleware';

const router = Router();

const productValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Название продукта должно быть от 2 до 100 символов'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Цена должна быть положительным числом'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Описание не должно превышать 500 символов'),
];

// Id validation
const idValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID должен быть положительным числом')
];

// Routes
router.get(
  '/',
  validateRequest,
  productController.getAll.bind(productController)
);

router.get(
  '/:id',
  idValidation,
  validateRequest,
  productController.getById.bind(productController)
);

router.post(
  '/',
  productValidation,
  validateRequest,
  productController.create.bind(productController)
);

router.put(
  '/:id',
  [...idValidation, ...productValidation],
  validateRequest,
  productController.update.bind(productController)
);

router.delete(
  '/:id',
  idValidation,
  validateRequest,
  productController.delete.bind(productController)
);

export const productRouter = router;