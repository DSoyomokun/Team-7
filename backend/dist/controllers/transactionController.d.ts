import { Request, Response } from 'express';
declare const transactionController: {
    addIncome: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    addExpense: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    incomeSummary: (req: Request, res: Response) => Promise<void>;
    expenseSummary: (req: Request, res: Response) => Promise<void>;
    getExpenses: (req: Request, res: Response) => Promise<void>;
    createTransaction: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getTransactions: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getTransactionById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    updateTransaction: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    deleteTransaction: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
};
export default transactionController;
