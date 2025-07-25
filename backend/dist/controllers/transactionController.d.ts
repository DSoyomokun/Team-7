import { Request, Response } from 'express';
declare const transactionController: {
    addIncome: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
    addExpense: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
    incomeSummary: (req: Request, res: Response) => void;
    expenseSummary: (req: Request, res: Response) => void;
    getExpenses: (req: Request, res: Response) => void;
    createTransaction: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getTransactions: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
};
export default transactionController;
