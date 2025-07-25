import { Request, Response } from 'express';
declare const goalController: {
    createGoal: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getGoals: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getGoalById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    updateGoal: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    updateProgress: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    markCompleted: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    deleteGoal: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getAnalytics: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getRecommendations: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    syncProgressFromTransactions: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
};
export default goalController;
