import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';

interface ValidationErrorResponse {
  errors: Array<{
    field: string;
    message: string;
  }>;
}

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const response: ValidationErrorResponse = {
      errors: errors.array().map((err: ValidationError) => ({
        field: err.type === 'field' ? err.path : err.type,
        message: err.msg
      }))
    };
    res.status(400).json(response);
    return;
  }
  next();
};