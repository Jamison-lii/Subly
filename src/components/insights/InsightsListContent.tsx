'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Navigation } from '@/components/dashboard/Navigation';
import { 
  LightBulbIcon, 
  CheckCircleIcon,
  XMarkIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface Insight {
  id: string;
  user_id: string;
  type: string;
  message: string;
  subscription_id: string;
  action_taken: 'pending' | 'accepted' | 'dismissed';
  created_at: string;
}

type InsightsListContentProps = {
  user: { id: string; name?: string; email: string };
};

export function InsightsListContent({ user }: InsightsListContentProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Fetch insights
  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      setError('');

      try {
        const { data, error } = await supabase
          .from('insights')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching insights:', error);
          setError(error.message);
        } else {
          setInsights(data || []);
        }
      } catch (err) {
        console.error('Error fetching insights:', err);
        setError('Failed to fetch insights');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [user.id]);

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Update insight action
  const handleAction = async (insightId: string, action: 'accepted' | 'dismissed') => {
    setUpdatingId(insightId);
    setError('');

    try {
      const { error } = await supabase
        .from('insights')
        .update({ action_taken: action })
        .eq('id', insightId);

      if (error) {
        setError(error.message);
      } else {
        // Update local state
        setInsights(prev => 
          prev.map(insight => 
            insight.id === insightId 
              ? { ...insight, action_taken: action }
              : insight
          )
        );
        setToast(`Insight ${action}`);
      }
    } catch (err) {
      setError('Failed to update insight');
    } finally {
      setUpdatingId(null);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'cancel':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'downgrade':
        return <InformationCircleIcon className="h-5 w-5 text-orange-500" />;
      case 'bundle':
        return <LightBulbIcon className="h-5 w-5 text-blue-500" />;
      case 'optimize':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      default:
        return <LightBulbIcon className="h-5 w-5 text-emerald-500" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'cancel':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'downgrade':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'bundle':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'optimize':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
              <p className="text-gray-600 mt-2">
                Personalized recommendations to optimize your subscription spending
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <ClockIcon className="h-4 w-4" />
                <span>Updated daily</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {insights.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-4">
              <LightBulbIcon className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No insights yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We're analyzing your subscriptions and will generate personalized insights soon. 
              Check back later for money-saving recommendations.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                        {getInsightIcon(insight.type)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getInsightColor(insight.type)}`}>
                            {insight.type}
                          </span>
                          {insight.action_taken !== 'pending' && (
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              insight.action_taken === 'accepted' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {insight.action_taken}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(insight.created_at)}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        {insight.message}
                      </p>
                      
                      {insight.action_taken === 'pending' && (
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleAction(insight.id, 'accepted')}
                            disabled={updatingId === insight.id}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                          >
                            {updatingId === insight.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            ) : (
                              <CheckCircleIcon className="h-4 w-4 mr-2" />
                            )}
                            Take Action
                          </button>
                          <button
                            onClick={() => handleAction(insight.id, 'dismissed')}
                            disabled={updatingId === insight.id}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                          >
                            {updatingId === insight.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                            ) : (
                              <XMarkIcon className="h-4 w-4 mr-2" />
                            )}
                            Dismiss
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {insights.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">{insights.length}</p>
                <p className="text-sm text-gray-600">Total insights</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {insights.filter(i => i.action_taken === 'accepted').length}
                </p>
                <p className="text-sm text-gray-600">Actions taken</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">
                  {insights.filter(i => i.action_taken === 'pending').length}
                </p>
                <p className="text-sm text-gray-600">Pending review</p>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
} 