import { ArrowUp, ArrowDown, TrendingUp, DollarSign } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string;
  change: number;
  changeType?: 'increase' | 'decrease';
  icon?: React.ReactNode;
}

export function SummaryCard({
  title,
  value,
  change,
  changeType = 'increase',
  icon = <DollarSign className="h-5 w-5" />
}: SummaryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <div className={`mt-2 flex items-center ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
            {changeType === 'increase' ? (
              <ArrowUp className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 mr-1" />
            )}
            <span className="text-sm font-medium">
              {change}% from last month
            </span>
          </div>
        </div>
        <div className="p-3 rounded-full bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );
}
