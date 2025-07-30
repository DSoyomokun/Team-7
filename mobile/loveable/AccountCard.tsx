import { Card } from "@/components/ui/card";

interface AccountCardProps {
  accountName: string;
  balance: number;
  accountType: string;
  currency?: string;
}

export const AccountCard = ({ 
  accountName, 
  balance, 
  accountType, 
  currency = "USD" 
}: AccountCardProps) => {
  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card className="glass-card glass-shadow rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:neon-glow group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-xl"></div>
      <div className="relative z-10 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-sf-pro font-semibold text-card-foreground text-lg">
              {accountName}
            </h3>
            <p className="text-muted-foreground text-sm font-medium">
              {accountType}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center neon-border group-hover:neon-glow transition-all duration-300">
            <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]"></div>
          </div>
        </div>
        
        <div className="pt-2">
          <p className="text-3xl font-sf-pro font-bold text-card-foreground tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
            {formatBalance(balance)}
          </p>
        </div>
      </div>
    </Card>
  );
};
