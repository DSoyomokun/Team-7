interface TransactionItemProps {
    description: string;
    amount: number;
    date: string;
    category: string;
    type: "income" | "expense";
  }
  
  export const TransactionItem = ({
    description,
    amount,
    date,
    category,
    type
  }: TransactionItemProps) => {
    const formatAmount = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(Math.abs(amount));
    };
  
    return (
      <div className="flex items-center justify-between p-4 rounded-xl bg-card/20 backdrop-blur-sm border border-foreground/10 transition-all duration-300 hover:bg-card/30 hover:neon-border group">
        <div className="flex items-center space-x-4">
          <div className={`w-3 h-3 rounded-full shadow-lg ${
            type === "income" 
              ? "bg-green-400 shadow-green-400/50" 
              : "bg-red-400 shadow-red-400/50"
          }`}></div>
          <div>
            <p className="font-sf-pro font-semibold text-card-foreground text-base">
              {description}
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{category}</span>
              <span>•</span>
              <span>{date}</span>
            </div>
          </div>
        </div>
        <p className={`font-sf-pro font-bold text-lg ${
          type === "income" 
            ? "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.3)]" 
            : "text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.3)]"
        }`}>
          {type === "income" ? "+" : "-"}{formatAmount(amount)}
        </p>
      </div>
    );
  };
  