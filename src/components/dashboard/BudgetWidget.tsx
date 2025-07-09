import { ChartPieIcon } from '@heroicons/react/24/outline';

export function BudgetWidget() {
  const percentage = 22; // 22% of monthly income
  const monthlyIncome = 4000; // Example monthly income
  const recurringSpend = 890; // Current recurring spend
  
  // Calculate the circumference and stroke-dasharray for the progress circle
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <ChartPieIcon className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold text-gray-900">Budget Health</h3>
      </div>

      <div className="flex items-center justify-center">
        <div className="relative">
          {/* Background circle */}
          <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 150 150">
            <circle
              cx="75"
              cy="75"
              r={radius}
              stroke="#E5E7EB"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx="75"
              cy="75"
              r={radius}
              stroke="#007A5E"
              strokeWidth="8"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{percentage}%</div>
              <div className="text-sm text-gray-600">of income</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Monthly Income</span>
            <span className="text-sm font-semibold text-gray-900">
              ${monthlyIncome.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Recurring Spend</span>
            <span className="text-sm font-semibold text-gray-900">
              ${recurringSpend.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            You&apos;re spending <span className="font-semibold text-primary">{percentage}%</span> of your monthly income on recurring services.
          </p>
          
          <div className="mt-3">
            {percentage <= 20 ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Excellent
              </span>
            ) : percentage <= 30 ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Good
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                High
              </span>
            )}
          </div>
        </div>

        <button className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
          Set Budget Limit
        </button>
      </div>
    </div>
  );
} 