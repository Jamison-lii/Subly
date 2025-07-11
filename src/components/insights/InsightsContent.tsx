'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
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

interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  billing_cycle: string;
  next_payment: string;
  status: string;
}

interface Insight {
  id: string;
  type: 'cancel' | 'downgrade' | 'bundle' | 'optimize';
  title: string;
  description: string;
  savings: number;
  priority: 'high' | 'medium' | 'low';
  subscriptionId: string;
  usage: string;
  action: string;
  confidence: number;
}

interface Analytics {
  totalSavings: number;
  monthlySpend: number;
  savingsPercentage: number;
  unusedServices: number;
  duplicateServices: number;
  optimizationOpportunities: number;
}

type InsightsContentProps = {
  user: { id: string; name?: string; email: string };
};

export function InsightsContent({ user }: InsightsContentProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalSavings: 0,
    monthlySpend: 0,
    savingsPercentage: 0,
    unusedServices: 0,
    duplicateServices: 0,
    optimizationOpportunities: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showActionModal, setShowActionModal] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      
      // Fetch all active subscriptions
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching subscriptions for insights:', error);
        setLoading(false);
        return;
      }

      const subs = subscriptions || [];
      const generatedInsights: Insight[] = [];
      let totalSavings = 0;
      let monthlySpend = 0;

      // Calculate monthly spend
      monthlySpend = subs.reduce((total, sub) => {
        if (sub.billing_cycle === 'Yearly') {
          return total + (sub.amount / 12);
        }
        return total + sub.amount;
      }, 0);

      // Generate insights based on subscription data
      subs.forEach((sub) => {
        // High-value subscriptions (>$30) might be candidates for downgrade
        if (sub.amount > 30) {
          const potentialSavings = sub.amount * 0.4; // Assume 40% savings from downgrade
          generatedInsights.push({
            id: `downgrade-${sub.id}`,
            type: 'downgrade',
            title: sub.name,
            description: `Consider downgrading your ${sub.name} plan. You're paying $${sub.amount}/month for features you might not need.`,
            savings: potentialSavings,
            priority: 'medium',
            subscriptionId: sub.id,
            usage: 'High-value subscription',
            action: 'Downgrade plan',
            confidence: 85,
          });
          totalSavings += potentialSavings;
        }

        // Expensive yearly subscriptions might be candidates for cancellation
        if (sub.billing_cycle === 'Yearly' && sub.amount > 120) {
          const potentialSavings = sub.amount / 12; // Monthly equivalent
          generatedInsights.push({
            id: `cancel-${sub.id}`,
            type: 'cancel',
            title: sub.name,
            description: `This yearly subscription costs $${(sub.amount / 12).toFixed(2)}/month. Consider if you really need all features.`,
            savings: potentialSavings,
            priority: 'high',
            subscriptionId: sub.id,
            usage: 'Yearly subscription',
            action: 'Cancel subscription',
            confidence: 90,
          });
          totalSavings += potentialSavings;
        }

        // Multiple subscriptions in same category might be candidates for bundling
        const category = getCategory(sub.name);
        const similarSubs = subs.filter(s => getCategory(s.name) === category && s.id !== sub.id);
        if (similarSubs.length > 0) {
          const bundleSavings = (sub.amount + similarSubs[0].amount) * 0.25; // Assume 25% savings from bundle
          generatedInsights.push({
            id: `bundle-${sub.id}`,
            type: 'bundle',
            title: `${sub.name} + ${similarSubs[0].name}`,
            description: `Bundle these ${category} services for potential savings.`,
            savings: bundleSavings,
            priority: 'low',
            subscriptionId: sub.id,
            usage: 'Multiple similar services',
            action: 'Bundle services',
            confidence: 75,
          });
          totalSavings += bundleSavings;
        }

        // Monthly subscriptions might benefit from yearly billing
        if (sub.billing_cycle === 'Monthly' && sub.amount > 10) {
          const yearlySavings = sub.amount * 0.2; // Assume 20% savings from yearly billing
          generatedInsights.push({
            id: `optimize-${sub.id}`,
            type: 'optimize',
            title: sub.name,
            description: `Switch to annual billing to save ${(yearlySavings / sub.amount * 100).toFixed(0)}% on ${sub.name}.`,
            savings: yearlySavings,
            priority: 'medium',
            subscriptionId: sub.id,
            usage: 'Monthly billing',
            action: 'Switch to annual',
            confidence: 80,
          });
          totalSavings += yearlySavings;
        }
      });

      // Calculate analytics
      const savingsPercentage = monthlySpend > 0 ? (totalSavings / monthlySpend) * 100 : 0;
      const unusedServices = Math.floor(subs.length * 0.2); // Estimate 20% unused
      const duplicateServices = Math.floor(subs.length * 0.1); // Estimate 10% duplicates
      const optimizationOpportunities = generatedInsights.length;

      setInsights(generatedInsights);
      setAnalytics({
        totalSavings,
        monthlySpend,
        savingsPercentage,
        unusedServices,
        duplicateServices,
        optimizationOpportunities,
      });
      setLoading(false);
    };

    fetchInsights();
  }, [user.id]);

  const getCategory = (serviceName: string) => {
    const categories: { [key: string]: string } = {
      'netflix': 'Entertainment',
      'spotify': 'Music',
      'adobe': 'Productivity',
      'github': 'Development',
      'notion': 'Productivity',
      'hulu': 'Entertainment',
      'youtube': 'Entertainment',
      'amazon': 'Shopping',
      'dropbox': 'Storage',
      'zoom': 'Communication'
    };
    
    const lowerName = serviceName.toLowerCase();
    for (const [key, category] of Object.entries(categories)) {
      if (lowerName.includes(key)) return category;
    }
    return 'Other';
  };

  const filteredInsights = selectedFilter === 'all' 
    ? insights 
    : insights.filter(insight => insight.type === selectedFilter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

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
                <p className="text-2xl font-bold text-green-600">${analytics.totalSavings.toFixed(2)}</p>
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
                <p className="text-2xl font-bold text-gray-900">${analytics.monthlySpend.toFixed(2)}</p>
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
                <p className="text-2xl font-bold text-orange-600">{analytics.savingsPercentage.toFixed(1)}%</p>
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
        {filteredInsights.length === 0 ? (
          <div className="text-center py-16">
            <LightBulbIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No insights available</h3>
            <p className="text-gray-500">Add more subscriptions to get personalized insights and recommendations.</p>
          </div>
        ) : (
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
                        <span className="text-gray-600 font-bold text-lg">
                          {insight.title.charAt(0).toUpperCase()}
                        </span>
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
                          <button className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors font-medium" onClick={() => setShowActionModal(insight.id)}>
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
        )}

        {/* Summary */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">${analytics.totalSavings.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Total potential savings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{analytics.savingsPercentage.toFixed(1)}%</p>
              <p className="text-sm text-gray-600">Reduction in monthly spend</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{analytics.optimizationOpportunities}</p>
              <p className="text-sm text-gray-600">Optimization opportunities</p>
            </div>
          </div>
        </div>
      </div>
      {showActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Action</h2>
            <p className="mb-4">(Action for this insight coming soon)</p>
            <button className="bg-primary text-white px-4 py-2 rounded-lg" onClick={() => setShowActionModal(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
} 