import { Request, Response } from 'express';
interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        full_name?: string;
        created_at: string;
    };
}
export default class ReportController {
    /**
     * Get spending report
     */
    static getSpendingReport(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Get income report
     */
    static getIncomeReport(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Get budget vs actual report
     */
    static getBudgetVsActualReport(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Get savings report
     */
    static getSavingsReport(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Get comprehensive financial report
     */
    static getComprehensiveReport(req: AuthenticatedRequest, res: Response): Promise<void>;
}
export {};
