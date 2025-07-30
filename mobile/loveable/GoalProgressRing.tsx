interface GoalProgressRingProps {
    title: string;
    current: number;
    target: number;
    color: string;
  }
  
  export const GoalProgressRing = ({ title, current, target, color }: GoalProgressRingProps) => {
    const percentage = (current / target) * 100;
    const circumference = 2 * Math.PI * 45; // radius of 45
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
    const formatAmount = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };
  
    return (
      <div className="flex items-center space-x-6 p-4 rounded-xl bg-card/20 backdrop-blur-sm border border-foreground/10 transition-all duration-300 hover:bg-card/30 hover:neon-border group">
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-foreground/20"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke={color}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-in-out drop-shadow-[0_0_10px_currentColor]"
              style={{ filter: `drop-shadow(0 0 8px ${color})` }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-sf-pro font-bold text-card-foreground drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
        
        <div className="flex-1 space-y-2">
          <h3 className="font-sf-pro font-semibold text-card-foreground text-lg">
            {title}
          </h3>
          <div className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Current</span>
              <span className="font-semibold text-card-foreground">
                {formatAmount(current)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Target</span>
              <span className="font-semibold text-card-foreground">
                {formatAmount(target)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  