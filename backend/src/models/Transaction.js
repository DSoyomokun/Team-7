class Transaction { 
    constructor({ id, user_id, amount, description, date, category, is_expense }) {
        this.id = id;
        this.user_id = user_id;
        this.amount = amount;
        this.description = description;
        this.date = date;
        this.category = category;
        this.is_expense = is_expense;
    }

    toJSON() {
        return {
            user_id: this.user_id,
            amount: this.amount,
            description: this.description,
            date: this.date,
            category: this.category,
            is_expense: this.is_expense
        };
    }

    isOverBudget(budgetLimit) {
        return this.is_expense && this.amount > budgetLimit;
    }

    isRecurring() {
        const keywords = ['subscription', 'membership', 'monthly'];
        return keywords.some(keyword =>
            this.description.toLowerCase().includes(keyword)
        );
    }
}

module.exports = Transaction;
