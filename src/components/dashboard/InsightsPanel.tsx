'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { LightBulbIcon, XMarkIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

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
  type: 'cancel' | 'downgrade' | 'bundle';
  title: string;
  description: string;
  savings: number;
  priority: 'high' | 'medium' | 'low';
  subscriptionId: string;
}

type InsightsPanelProps = {
  user: { id: string; name?: string; email: string };
};

export function InsightsPanel({ user }: InsightsPanelProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSavings, setTotalSavings] = useState(0);

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
      let totalSavingsAmount = 0;

      // Generate insights based on subscription data
      subs.forEach((sub, index) => {
        // High-value subscriptions (>$20) might be candidates for downgrade
        if (sub.amount > 20) {
          const potentialSavings = sub.amount * 0.3; // Assume 30% savings from downgrade
          generatedInsights.push({
            id: `downgrade-${sub.id}`,
            type: 'downgrade',
            title: sub.name,
            description: `Consider downgrading your ${sub.name} plan to save money.`,
            savings: potentialSavings,
            priority: 'medium',
            subscriptionId: sub.id,
          });
          totalSavingsAmount += potentialSavings;
        }

        // Expensive yearly subscriptions might be candidates for cancellation
        if (sub.billing_cycle === 'Yearly' && sub.amount > 100) {
          const potentialSavings = sub.amount / 12; // Monthly equivalent
          generatedInsights.push({
            id: `cancel-${sub.id}`,
            type: 'cancel',
            title: sub.name,
            description: `This yearly subscription costs $${(sub.amount / 12).toFixed(2)}/month. Consider if you really need it.`,
            savings: potentialSavings,
            priority: 'high',
            subscriptionId: sub.id,
          });
          totalSavingsAmount += potentialSavings;
        }

        // Multiple subscriptions in same category might be candidates for bundling
        const category = getCategory(sub.name);
        const similarSubs = subs.filter(s => getCategory(s.name) === category && s.id !== sub.id);
        if (similarSubs.length > 0) {
          const bundleSavings = (sub.amount + similarSubs[0].amount) * 0.2; // Assume 20% savings from bundle
          generatedInsights.push({
            id: `bundle-${sub.id}`,
            type: 'bundle',
            title: `${sub.name} + ${similarSubs[0].name}`,
            description: `Bundle these ${category} services for potential savings.`,
            savings: bundleSavings,
            priority: 'low',
            subscriptionId: sub.id,
          });
          totalSavingsAmount += bundleSavings;
        }
      });

      // Limit to top 3 insights
      const topInsights = generatedInsights
        .sort((a, b) => b.savings - a.savings)
        .slice(0, 3);

      setInsights(topInsights);
      setTotalSavings(totalSavingsAmount);
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-primary to-primary/80 rounded-lg">
              <LightBulbIcon className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Smart Insights</h3>
          </div>
        </div>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

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

      {insights.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No insights available yet</p>
          <p className="text-xs text-gray-400 mt-2">Add more subscriptions to get personalized insights</p>
        </div>
      ) : (
        <>
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
                      <span className="text-gray-600 font-bold text-lg">
                        {insight.title.charAt(0).toUpperCase()}
                      </span>
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
                Potential monthly savings: <span className="font-bold text-green-600 text-lg">${totalSavings.toFixed(2)}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Based on your subscription patterns and AI analysis
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 