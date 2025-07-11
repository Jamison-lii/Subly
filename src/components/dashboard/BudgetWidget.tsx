'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ChartPieIcon } from '@heroicons/react/24/outline';

interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  billing_cycle: string;
  next_payment: string;
  status: string;
}

type BudgetWidgetProps = {
  user: { id: string; name?: string; email: string };
};

export function BudgetWidget({ user }: BudgetWidgetProps) {
  const [monthlySpend, setMonthlySpend] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Default monthly income (could be made configurable later)
  const monthlyIncome = 4000;
  
  useEffect(() => {
    const fetchBudgetData = async () => {
      setLoading(true);
      
      // Fetch all active subscriptions
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching subscriptions for budget:', error);
        setLoading(false);
        return;
      }

      const subs = subscriptions || [];
      
      // Calculate total monthly spend
      const totalMonthlySpend = subs.reduce((total, sub) => {
        // Convert yearly to monthly for calculation
        if (sub.billing_cycle === 'Yearly') {
          return total + (sub.amount / 12);
        }
        return total + sub.amount;
      }, 0);

      setMonthlySpend(totalMonthlySpend);
      setLoading(false);
    };

    fetchBudgetData();
  }, [user.id]);

  const percentage = Math.round((monthlySpend / monthlyIncome) * 100);
  
  // Calculate the circumference and stroke-dasharray for the progress circle
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <ChartPieIcon className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">Budget Health</h3>
        </div>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

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
              ${monthlySpend.toFixed(2)}
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