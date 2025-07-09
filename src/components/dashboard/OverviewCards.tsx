import { 
  CreditCardIcon, 
  CurrencyDollarIcon, 
  CalendarIcon, 
  BanknotesIcon 
} from '@heroicons/react/24/outline';

const summaryData = [
  {
    title: 'Active Subscriptions',
    value: '12',
    change: '+2',
    changeType: 'positive',
    icon: CreditCardIcon,
    color: 'bg-gradient-to-r from-blue-500 to-blue-600',
    description: 'This month'
  },
  {
    title: 'Monthly Spend',
    value: '$89.99',
    change: '-$12.50',
    changeType: 'positive',
    icon: CurrencyDollarIcon,
    color: 'bg-gradient-to-r from-green-500 to-green-600',
    description: 'vs last month'
  },
  {
    title: 'Upcoming Payments',
    value: '3',
    change: 'This week',
    changeType: 'neutral',
    icon: CalendarIcon,
    color: 'bg-gradient-to-r from-orange-500 to-orange-600',
    description: 'Due soon'
  },
  {
    title: 'Savings This Month',
    value: '$24.99',
    change: '+$8.50',
    changeType: 'positive',
    icon: BanknotesIcon,
    color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    description: 'From optimizations'
  },
];

export function OverviewCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryData.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover-lift transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${card.color} shadow-lg`}>
              <card.icon className="h-6 w-6 text-white" />
            </div>
            <div className={`text-xs font-medium px-2 py-1 rounded-full ${
              card.changeType === 'positive'
                ? 'bg-green-100 text-green-700'
                : card.changeType === 'negative'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {card.change}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {card.value}
            </p>
            <p className="text-xs text-gray-500">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
} 