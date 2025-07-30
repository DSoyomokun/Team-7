import { AccountCard } from "./AccountCard";
import { TransactionItem } from "./TransactionItem";
import { GoalProgressRing } from "./GoalProgressRing";

const accounts = [
  {
    accountName: "Main Checking",
    balance: 15420.50,
    accountType: "Checking Account"
  },
  {
    accountName: "Savings Fund",
    balance: 28750.00,
    accountType: "Savings Account"
  },
  {
    accountName: "Investment",
    balance: 12340.75,
    accountType: "Brokerage Account"
  }
];

const transactions = [
  {
    description: "Grocery Store",
    amount: -85.32,
    date: "Today",
    category: "Food & Dining",
    type: "expense" as const
  },
  {
    description: "Salary Deposit",
    amount: 3200.00,
    date: "Yesterday",
    category: "Income",
    type: "income" as const
  },
  {
    description: "Netflix Subscription",
    amount: -15.99,
    date: "2 days ago",
    category: "Entertainment",
    type: "expense" as const
  },
  {
    description: "Gas Station",
    amount: -45.20,
    date: "3 days ago",
    category: "Transportation",
    type: "expense" as const
  }
];

const goals = [
  {
    title: "Emergency Fund",
    current: 8500,
    target: 15000,
    color: "hsl(267, 84%, 81%)"
  },
  {
    title: "Vacation",
    current: 2300,
    target: 5000,
    color: "hsl(285, 35%, 60%)"
  },
  {
    title: "New Car",
    current: 12000,
    target: 25000,
    color: "hsl(300, 100%, 75%)"
  }
];

export const FinancialDashboard = () => {
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sf-pro font-bold text-foreground drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            Financial Dashboard
          </h1>
          <div className="glass-card rounded-3xl p-6 max-w-md mx-auto neon-border">
            <p className="text-muted-foreground text-lg font-medium mb-2">Total Balance</p>
            <p className="text-4xl font-sf-pro font-bold text-foreground drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Account Cards */}
        <section>
          <h2 className="text-2xl font-sf-pro font-semibold text-foreground mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            Accounts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account, index) => (
              <AccountCard
                key={index}
                accountName={account.accountName}
                balance={account.balance}
                accountType={account.accountType}
              />
            ))}
          </div>
        </section>

        {/* Goals and Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Goals Section */}
          <section>
            <h2 className="text-2xl font-sf-pro font-semibold text-foreground mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              Financial Goals
            </h2>
            <div className="glass-card rounded-3xl p-6 space-y-6 neon-border">
              {goals.map((goal, index) => (
                <GoalProgressRing
                  key={index}
                  title={goal.title}
                  current={goal.current}
                  target={goal.target}
                  color={goal.color}
                />
              ))}
            </div>
          </section>

          {/* Recent Transactions */}
          <section>
            <h2 className="text-2xl font-sf-pro font-semibold text-foreground mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              Recent Transactions
            </h2>
            <div className="glass-card rounded-3xl p-6 space-y-4 neon-border">
              {transactions.map((transaction, index) => (
                <TransactionItem
                  key={index}
                  description={transaction.description}
                  amount={transaction.amount}
                  date={transaction.date}
                  category={transaction.category}
                  type={transaction.type}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
