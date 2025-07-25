import { Request, Response, NextFunction } from 'express';
export declare const validateSignUp: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateLogin: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateProfileUpdate: (req: Request, res: Response, next: NextFunction) => void;
export declare const validatePreferencesUpdate: (req: Request, res: Response, next: NextFunction) => void;
