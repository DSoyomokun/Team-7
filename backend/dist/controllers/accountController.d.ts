import { Request, Response } from 'express';
declare const accountController: {
    create: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getAll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    update: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    delete: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getBalanceSummary: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
};
export default accountController;
