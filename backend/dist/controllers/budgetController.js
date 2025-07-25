"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.budgetController = exports.BudgetController = void 0;
const budget_service_1 = require("../services/budget_service");
class BudgetController {
    // GET /api/budget/analysis?period=month&year=2024
    async getBudgetAnalysis(req, res) {
        try {
            const userId = req.userId;
            const { period = 'month', year } = req.query;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'User authentication required'
                });
            }
            const analysis = await budget_service_1.budgetService.getBudgetAnalysis(userId, period, year ? parseInt(year) : undefined);
            res.status(200).json({
                success: true,
                data: analysis
            });
        }
        catch (error) {
            console.error('Budget analysis error:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get budget analysis'
            });
        }
    }
    // GET /api/budget/trends?period=month&months=6
    async getBudgetTrends(req, res) {
        try {
            const userId = req.userId;
            const { period = 'month', months = '6' } = req.query;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'User authentication required'
                });
            }
            const trends = await budget_service_1.budgetService.getBudgetTrends(userId, period, parseInt(months));
            res.status(200).json({
                success: true,
                data: trends
            });
        }
        catch (error) {
            console.error('Budget trends error:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get budget trends'
            });
        }
    }
    // GET /api/budget/categories?period=month
    async getCategoryBreakdown(req, res) {
        try {
            const userId = req.userId;
            const { period = 'month' } = req.query;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'User authentication required'
                });
            }
            const categories = await budget_service_1.budgetService.getCategoryBreakdown(userId, period);
            res.status(200).json({
                success: true,
                data: categories
            });
        }
        catch (error) {
            console.error('Category breakdown error:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get category breakdown'
            });
        }
    }
    // POST /api/budget/limits
    async createBudgetLimit(req, res) {
        try {
            const userId = req.userId;
            const { category_id, limit_amount, period } = req.body;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'User authentication required'
                });
            }
            if (!category_id || limit_amount === undefined || !period) {
                return res.status(400).json({
                    success: false,
                    error: 'category_id, limit_amount, and period are required'
                });
            }
            if (!['weekly', 'monthly', 'yearly'].includes(period)) {
                return res.status(400).json({
                    success: false,
                    error: 'period must be one of: weekly, monthly, yearly'
                });
            }
            const budgetLimit = await budget_service_1.budgetService.createBudgetLimit(userId, category_id, parseFloat(limit_amount), period);
            res.status(201).json({
                success: true,
                data: budgetLimit.toJSON()
            });
        }
        catch (error) {
            console.error('Create budget limit error:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create budget limit'
            });
        }
    }
    // GET /api/budget/limits
    async getBudgetLimits(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'User authentication required'
                });
            }
            const limits = await budget_service_1.budgetService.getBudgetLimits(userId);
            res.status(200).json({
                success: true,
                data: limits.map(limit => limit.toJSON())
            });
        }
        catch (error) {
            console.error('Get budget limits error:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get budget limits'
            });
        }
    }
    // PUT /api/budget/limits/:id
    async updateBudgetLimit(req, res) {
        try {
            const { id } = req.params;
            const { limit_amount, period } = req.body;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    error: 'Budget limit ID is required'
                });
            }
            if (limit_amount === undefined) {
                return res.status(400).json({
                    success: false,
                    error: 'limit_amount is required'
                });
            }
            if (period && !['weekly', 'monthly', 'yearly'].includes(period)) {
                return res.status(400).json({
                    success: false,
                    error: 'period must be one of: weekly, monthly, yearly'
                });
            }
            const updatedLimit = await budget_service_1.budgetService.updateBudgetLimit(id, parseFloat(limit_amount), period);
            res.status(200).json({
                success: true,
                data: updatedLimit.toJSON()
            });
        }
        catch (error) {
            console.error('Update budget limit error:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update budget limit'
            });
        }
    }
    // DELETE /api/budget/limits/:id
    async deleteBudgetLimit(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    error: 'Budget limit ID is required'
                });
            }
            await budget_service_1.budgetService.deleteBudgetLimit(id);
            res.status(200).json({
                success: true,
                message: 'Budget limit deleted successfully'
            });
        }
        catch (error) {
            console.error('Delete budget limit error:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to delete budget limit'
            });
        }
    }
    // GET /api/budget/warnings
    async getBudgetWarnings(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'User authentication required'
                });
            }
            const warnings = await budget_service_1.budgetService.getBudgetWarnings(userId);
            res.status(200).json({
                success: true,
                data: warnings
            });
        }
        catch (error) {
            console.error('Budget warnings error:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get budget warnings'
            });
        }
    }
    // GET /api/budget/export?type=spending&period=month&format=csv
    async exportBudgetReport(req, res) {
        try {
            const userId = req.userId;
            const { type, period = 'month', format = 'json' } = req.query;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'User authentication required'
                });
            }
            if (!type) {
                return res.status(400).json({
                    success: false,
                    error: 'Export type is required (spending, limits, trends)'
                });
            }
            if (!['spending', 'limits', 'trends'].includes(type)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid export type. Must be one of: spending, limits, trends'
                });
            }
            if (!['csv', 'json', 'pdf'].includes(format)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid format. Must be one of: csv, json, pdf'
                });
            }
            const exportData = await budget_service_1.budgetService.exportBudgetReport(userId, type, period, format);
            // Set appropriate headers based on format
            switch (format) {
                case 'csv':
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', `attachment; filename="${exportData.filename}"`);
                    res.send(exportData.data);
                    break;
                case 'json':
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Content-Disposition', `attachment; filename="${exportData.filename}"`);
                    res.json(exportData.data);
                    break;
                case 'pdf':
                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', `attachment; filename="${exportData.filename}"`);
                    res.send(exportData.data);
                    break;
            }
        }
        catch (error) {
            console.error('Export budget report error:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to export budget report'
            });
        }
    }
}
exports.BudgetController = BudgetController;
exports.budgetController = new BudgetController();
//# sourceMappingURL=budgetController.js.map