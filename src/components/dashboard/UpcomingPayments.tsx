import { CalendarIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const upcomingPayments = [
  {
    id: 1,
    service: 'Netflix',
    amount: 9.99,
    dueDate: 'June 25',
    status: 'upcoming',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    category: 'Entertainment',
    color: 'bg-red-500'
  },
  {
    id: 2,
    service: 'Spotify Premium',
    amount: 12.99,
    dueDate: 'June 27',
    status: 'upcoming',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
    category: 'Music',
    color: 'bg-green-500'
  },
  {
    id: 3,
    service: 'Adobe Creative Cloud',
    amount: 52.99,
    dueDate: 'June 30',
    status: 'upcoming',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg',
    category: 'Productivity',
    color: 'bg-orange-500'
  },
  {
    id: 4,
    service: 'GitHub Pro',
    amount: 4.99,
    dueDate: 'July 2',
    status: 'upcoming',
    logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    category: 'Development',
    color: 'bg-gray-800'
  },
  {
    id: 5,
    service: 'Notion Personal',
    amount: 4.99,
    dueDate: 'July 5',
    status: 'upcoming',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
    category: 'Productivity',
    color: 'bg-black'
  },
];

export function UpcomingPayments() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          This Week&apos;s Charges
        </h3>
        <button className="text-sm text-primary hover:text-primary/80 font-medium flex items-center group">
          View All
          <ChevronRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {upcomingPayments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl ${payment.color} flex items-center justify-center shadow-lg`}>
                  <img 
                    src={payment.logo} 
                    alt={payment.service}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">$</span>
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{payment.service}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {payment.category}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {payment.dueDate}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900 text-lg">
                ${payment.amount.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">Monthly</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 font-medium">Total this week:</span>
          <span className="font-bold text-gray-900 text-lg">$85.95</span>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Next billing cycle: July 1-7
        </div>
      </div>
    </div>
  );
} 