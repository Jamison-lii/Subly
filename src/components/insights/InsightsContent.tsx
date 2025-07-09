'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';
import { Navigation } from '@/components/dashboard/Navigation';
import { 
  LightBulbIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

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
    usage: '0 hours this month',
    confidence: 95,
    action: 'Cancel subscription'
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
    usage: 'Light usage detected',
    confidence: 87,
    action: 'Downgrade plan'
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
    usage: 'Both services active',
    confidence: 78,
    action: 'Bundle services'
  },
  {
    id: 4,
    type: 'optimize',
    title: 'GitHub Pro',
    description: 'Consider annual billing to save 20%',
    savings: 9.99,
    logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    priority: 'medium',
    currentPlan: 'Monthly',
    alternative: 'Annual billing',
    confidence: 82,
    action: 'Switch to annual'
  }
];

const analytics = {
  totalSavings: 57.98,
  monthlySpend: 89.94,
  savingsPercentage: 64.5,
  unusedServices: 2,
  duplicateServices: 1,
  optimizationOpportunities: 4
};

export function InsightsContent() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useState(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      router.push('/auth/login');
    }
    setIsLoading(false);
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const filteredInsights = selectedFilter === 'all' 
    ? insights 
    : insights.filter(insight => insight.type === selectedFilter);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
              <p className="text-gray-600 mt-2">
                Smart recommendations to optimize your subscription spending
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-sm text-gray-600 hover:text-gray-900">
                <ChartBarIcon className="h-5 w-5" />
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-900">
                <ClockIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Potential Savings</p>
                <p className="text-2xl font-bold text-green-600">${analytics.totalSavings}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Spend</p>
                <p className="text-2xl font-bold text-gray-900">${analytics.monthlySpend}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Savings %</p>
                <p className="text-2xl font-bold text-orange-600">{analytics.savingsPercentage}%</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <ArrowTrendingDownIcon className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Opportunities</p>
                <p className="text-2xl font-bold text-purple-600">{analytics.optimizationOpportunities}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <LightBulbIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Insights
            </button>
            <button
              onClick={() => setSelectedFilter('cancel')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === 'cancel'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={() => setSelectedFilter('downgrade')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === 'downgrade'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Downgrade
            </button>
            <button
              onClick={() => setSelectedFilter('bundle')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === 'bundle'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Bundle
            </button>
            <button
              onClick={() => setSelectedFilter('optimize')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === 'optimize'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Optimize
            </button>
          </div>
        </div>

        {/* Insights List */}
        <div className="space-y-6">
          {filteredInsights.map((insight) => (
            <div
              key={insight.id}
              className={`bg-white rounded-xl border-l-4 shadow-sm hover:shadow-md transition-all duration-200 ${
                insight.priority === 'high'
                  ? 'border-red-500 bg-gradient-to-r from-red-50 to-white'
                  : insight.priority === 'medium'
                  ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-white'
                  : 'border-blue-500 bg-gradient-to-r from-blue-50 to-white'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                      <img 
                        src={insight.logo} 
                        alt={insight.title}
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            insight.type === 'cancel'
                              ? 'bg-red-100 text-red-700'
                              : insight.type === 'downgrade'
                              ? 'bg-orange-100 text-orange-700'
                              : insight.type === 'bundle'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {insight.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {insight.confidence}% confidence
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-green-600">
                          Save ${insight.savings.toFixed(2)}/month
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{insight.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Usage</p>
                        <p className="text-sm font-medium text-gray-900">{insight.usage}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Action</p>
                        <p className="text-sm font-medium text-gray-900">{insight.action}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Priority</p>
                        <p className="text-sm font-medium text-gray-900 capitalize">{insight.priority}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium">
                          Take Action
                        </button>
                        <button className="text-gray-500 hover:text-gray-700 text-sm">
                          Dismiss
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        <span className="text-sm text-gray-500">AI Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">${analytics.totalSavings}</p>
              <p className="text-sm text-gray-600">Total potential savings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{analytics.savingsPercentage}%</p>
              <p className="text-sm text-gray-600">Reduction in monthly spend</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{analytics.optimizationOpportunities}</p>
              <p className="text-sm text-gray-600">Optimization opportunities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 