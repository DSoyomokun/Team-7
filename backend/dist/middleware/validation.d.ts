import { Request, Response, NextFunction } from 'express';
export declare const validateProfileUpdate: (req: Request, res: Response, next: NextFunction) => void;
export declare const validatePreferencesUpdate: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateTransaction: (req: Request, res: Response, next: NextFunction) => void;
export declare const validatePasswordChange: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateDateRange: (req: Request, res: Response, next: NextFunction) => void;
export declare const validatePagination: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateSearchQuery: (req: Request, res: Response, next: NextFunction) => void;
