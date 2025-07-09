import { LightBulbIcon, XMarkIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const insights = [
  {
    id: 1,
    type: 'cancel',
    title: 'Spotify Premium',
    description: "Haven't used in 2 weeks. Consider canceling?",
    savings: 12.99,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
    priority: 'high',
    lastUsed: '2 weeks ago',
    usage: '0 hours this month'
  },
  {
    id: 2,
    type: 'downgrade',
    title: 'Adobe Creative Cloud',
    description: 'You only use 3 of 20+ apps. Downgrade to save $30/month.',
    savings: 30.00,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg',
    priority: 'medium',
    appsUsed: '3/20 apps',
    usage: 'Light usage detected'
  },
  {
    id: 3,
    type: 'bundle',
    title: 'Streaming Services',
    description: 'Bundle Netflix + Hulu for $5/month savings.',
    savings: 5.00,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    priority: 'low',
    alternative: 'Hulu + Netflix bundle',
    usage: 'Both services active'
  },
];

export function InsightsPanel() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-to-r from-primary to-primary/80 rounded-lg">
            <LightBulbIcon className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Smart Insights</h3>
        </div>
        <button className="text-sm text-primary hover:text-primary/80 font-medium flex items-center group">
          View All
          <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`p-4 rounded-xl border-l-4 shadow-sm hover:shadow-md transition-all duration-200 ${
              insight.priority === 'high'
                ? 'border-red-500 bg-gradient-to-r from-red-50 to-white'
                : insight.priority === 'medium'
                ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-white'
                : 'border-blue-500 bg-gradient-to-r from-blue-50 to-white'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                  <img 
                    src={insight.logo} 
                    alt={insight.title}
                    className="w-6 h-6 object-contain"
                  />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      insight.type === 'cancel'
                        ? 'bg-red-100 text-red-700'
                        : insight.type === 'downgrade'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {insight.type}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  {insight.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-semibold text-green-600">
                      Save ${insight.savings.toFixed(2)}/month
                    </span>
                    <span className="text-xs text-gray-500">
                      {insight.usage}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors font-medium">
                      Take Action
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Potential monthly savings: <span className="font-bold text-green-600 text-lg">$47.99</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Based on your usage patterns and AI analysis
          </p>
        </div>
      </div>
    </div>
  );
} 