'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { CreditCardIcon, CurrencyDollarIcon, CalendarIcon, BanknotesIcon } from '@heroicons/react/24/outline';

interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  billing_cycle: string;
  next_payment: string;
  status: string;
}

interface DashboardStats {
  activeSubscriptions: number;
  monthlySpend: number;
  upcomingPayments: number;
  potentialSavings: number;
}

type OverviewCardsProps = {
  user: { id: string; name?: string; email: string };
};

export function OverviewCards({ user }: OverviewCardsProps) {
  const [stats, setStats] = useState<DashboardStats>({
    activeSubscriptions: 0,
    monthlySpend: 0,
    upcomingPayments: 0,
    potentialSavings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      
      // Fetch all subscriptions for the user
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching subscriptions:', error);
        setLoading(false);
        return;
      }

      const subs = subscriptions || [];
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      // Calculate stats
      const activeSubscriptions = subs.length;
      const monthlySpend = subs.reduce((total, sub) => {
        // Convert yearly to monthly for calculation
        if (sub.billing_cycle === 'Yearly') {
          return total + (sub.amount / 12);
        }
        return total + sub.amount;
      }, 0);
      
      const upcomingPayments = subs.filter(sub => {
        if (!sub.next_payment) return false;
        const paymentDate = new Date(sub.next_payment);
        return paymentDate >= now && paymentDate <= nextWeek;
      }).length;

      // Simple potential savings calculation (could be enhanced with AI insights)
      const potentialSavings = Math.round(monthlySpend * 0.15); // Assume 15% potential savings

      setStats({
        activeSubscriptions,
        monthlySpend,
        upcomingPayments,
        potentialSavings,
      });
      setLoading(false);
    };

    fetchDashboardStats();
  }, [user.id]);

  const summaryData = [
    {
      title: 'Active Subscriptions',
      value: loading ? '...' : stats.activeSubscriptions.toString(),
      change: '+0',
      changeType: 'neutral' as const,
      icon: CreditCardIcon,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      description: 'This month'
    },
    {
      title: 'Monthly Spend',
      value: loading ? '...' : `$${stats.monthlySpend.toFixed(2)}`,
      change: '-$0.00',
      changeType: 'neutral' as const,
      icon: CurrencyDollarIcon,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      description: 'vs last month'
    },
    {
      title: 'Upcoming Payments',
      value: loading ? '...' : stats.upcomingPayments.toString(),
      change: 'This week',
      changeType: 'neutral' as const,
      icon: CalendarIcon,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      description: 'Due soon'
    },
    {
      title: 'Potential Savings',
      value: loading ? '...' : `$${stats.potentialSavings.toFixed(2)}`,
      change: '+$0.00',
      changeType: 'positive' as const,
      icon: BanknotesIcon,
      color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      description: 'From optimizations'
    },
  ];

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