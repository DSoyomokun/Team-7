import { Request, Response } from 'express';
export declare class BudgetController {
    getBudgetAnalysis(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getBudgetTrends(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getCategoryBreakdown(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    createBudgetLimit(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getBudgetLimits(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateBudgetLimit(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteBudgetLimit(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getBudgetWarnings(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    exportBudgetReport(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const budgetController: BudgetController;
