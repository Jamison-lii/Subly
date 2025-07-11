'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { CalendarIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  billing_cycle: string;
  next_payment: string;
  status: string;
}

type UpcomingPaymentsProps = {
  user: { id: string; name?: string; email: string };
};

export function UpcomingPayments({ user }: UpcomingPaymentsProps) {
  const [upcomingPayments, setUpcomingPayments] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchUpcomingPayments = async () => {
      setLoading(true);
      
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      // Fetch subscriptions with payments due in the next 7 days
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gte('next_payment', now.toISOString().split('T')[0])
        .lte('next_payment', nextWeek.toISOString().split('T')[0])
        .order('next_payment', { ascending: true });

      if (error) {
        console.error('Error fetching upcoming payments:', error);
        setLoading(false);
        return;
      }

      const payments = subscriptions || [];
      const total = payments.reduce((sum, payment) => sum + payment.amount, 0);
      
      setUpcomingPayments(payments);
      setTotalAmount(total);
      setLoading(false);
    };

    fetchUpcomingPayments();
  }, [user.id]);

  const getCategoryColor = (serviceName: string) => {
    const colors = [
      'bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500', 
      'bg-orange-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const index = serviceName.length % colors.length;
    return colors[index];
  };

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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            This Week&apos;s Charges
          </h3>
        </div>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

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
      
      {upcomingPayments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No upcoming payments this week</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {upcomingPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-xl ${getCategoryColor(payment.name)} flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-lg">
                        {payment.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">$</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{payment.name}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {getCategory(payment.name)}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {payment.next_payment ? new Date(payment.next_payment).toLocaleDateString() : 'No date'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-lg">
                    ${payment.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">{payment.billing_cycle}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Total this week:</span>
              <span className="font-bold text-gray-900 text-lg">${totalAmount.toFixed(2)}</span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {upcomingPayments.length} payment{upcomingPayments.length !== 1 ? 's' : ''} due
            </div>
          </div>
        </>
      )}
    </div>
  );
} 