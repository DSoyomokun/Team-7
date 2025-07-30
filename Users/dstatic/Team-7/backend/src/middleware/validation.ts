/**
 * Request Validation Middleware
 * Handles input validation for API endpoints
 */

import { Request, Response, NextFunction } from 'express';
import { validationResult, checkSchema } from 'express-validator';

export const validateRequest = (schema: any) => {
  return [
    checkSchema(schema),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }
      next();
    }
  ];
};