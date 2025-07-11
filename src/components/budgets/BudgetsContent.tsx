'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Navigation } from '@/components/dashboard/Navigation';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Budget {
  id: string;
  user_id: string;
  amount: number;
  period: string;
  created_at: string;
  updated_at: string;
}

interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  billing_cycle: string;
  next_payment: string;
  status: string;
}

type BudgetsContentProps = {
  user: { id: string; name?: string; email: string };
};

export function BudgetsContent({ user }: BudgetsContentProps) {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    period: 'monthly'
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Fetch budget and subscriptions
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        // Fetch user's budget
        const { data: budgetData, error: budgetError } = await supabase
          .from('budgets')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (budgetError && budgetError.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Error fetching budget:', budgetError);
          setError(budgetError.message);
        }

        // Fetch active subscriptions
        const { data: subscriptionsData, error: subscriptionsError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active');

        if (subscriptionsError) {
          console.error('Error fetching subscriptions:', subscriptionsError);
          setError(subscriptionsError.message);
        }

        setBudget(budgetData);
        setSubscriptions(subscriptionsData || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Calculate monthly spend
  const calculateMonthlySpend = () => {
    return subscriptions.reduce((total, sub) => {
      if (sub.billing_cycle === 'Yearly') {
        return total + (sub.amount / 12);
      }
      return total + sub.amount;
    }, 0);
  };

  const monthlySpend = calculateMonthlySpend();
  const budgetAmount = budget?.amount || 0;
  const usagePercentage = budgetAmount > 0 ? (monthlySpend / budgetAmount) * 100 : 0;
  const isOverBudget = usagePercentage > 100;

  // Add budget
  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('budgets')
        .insert([{
          user_id: user.id,
          amount: parseFloat(formData.amount),
          period: formData.period
        }])
        .select()
        .single();

      if (error) {
        setError(error.message);
      } else {
        setBudget(data);
        setShowAddForm(false);
        setFormData({ amount: '', period: 'monthly' });
        setToast('Budget added successfully');
      }
    } catch (err) {
      setError('Failed to add budget');
    } finally {
      setSubmitting(false);
    }
  };

  // Update budget
  const handleUpdateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('budgets')
        .update({
          amount: parseFloat(formData.amount),
          period: formData.period
        })
        .eq('id', budget?.id)
        .select()
        .single();

      if (error) {
        setError(error.message);
      } else {
        setBudget(data);
        setShowEditForm(false);
        setFormData({ amount: '', period: 'monthly' });
        setToast('Budget updated successfully');
      }
    } catch (err) {
      setError('Failed to update budget');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete budget
  const handleDeleteBudget = async () => {
    if (!budget) return;

    setSubmitting(true);
    setError('');

    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', budget.id);

      if (error) {
        setError(error.message);
      } else {
        setBudget(null);
        setToast('Budget deleted successfully');
      }
    } catch (err) {
      setError('Failed to delete budget');
    } finally {
      setSubmitting(false);
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Budget Management</h1>
              <p className="text-gray-600 mt-2">
                Track your subscription spending and stay within budget
              </p>
            </div>
            {!budget && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center space-x-2"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add Budget</span>
              </button>
            )}
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

        {!budget ? (
          // No budget - show add form
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                <PlusIcon className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Budget Set</h3>
              <p className="text-gray-500 mb-6">
                Set a monthly budget to track your subscription spending and get alerts when you exceed it.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 font-medium"
              >
                Set Your Budget
              </button>
            </div>
          </div>
        ) : (
          // Budget exists - show budget info
          <div className="space-y-6">
            {/* Budget Overview Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Monthly Budget</h2>
                  <p className="text-gray-600">Track your subscription spending</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setFormData({ amount: budget.amount.toString(), period: budget.period });
                      setShowEditForm(true);
                    }}
                    className="text-gray-600 hover:text-gray-900 p-2"
                    title="Edit Budget"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleDeleteBudget}
                    disabled={submitting}
                    className="text-red-600 hover:text-red-800 p-2"
                    title="Delete Budget"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Budget Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">${budget.amount.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Total Budget</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">${monthlySpend.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Used This Month</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">${(budget.amount - monthlySpend).toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Remaining</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Budget Usage</span>
                  <span className={`text-sm font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-700'}`}>
                    {usagePercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      isOverBudget ? 'bg-red-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Warning if over budget */}
              {isOverBudget && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">Budget Exceeded</p>
                      <p className="text-sm text-red-700">
                        You've exceeded your monthly budget by ${(monthlySpend - budget.amount).toFixed(2)}.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Subscriptions Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Breakdown</h3>
              {subscriptions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No active subscriptions found.</p>
              ) : (
                <div className="space-y-3">
                  {subscriptions.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{sub.name}</p>
                        <p className="text-sm text-gray-600">{sub.billing_cycle}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${sub.billing_cycle === 'Yearly' ? (sub.amount / 12).toFixed(2) : sub.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">per month</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Budget Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 shadow-lg w-full max-w-md relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowAddForm(false)}
                title="Close"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              <h2 className="text-xl font-bold mb-4">Add Monthly Budget</h2>
              <form onSubmit={handleAddBudget} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Budget Amount</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Budget'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Edit Budget Modal */}
        {showEditForm && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 shadow-lg w-full max-w-md relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowEditForm(false)}
                title="Close"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              <h2 className="text-xl font-bold mb-4">Edit Budget</h2>
              <form onSubmit={handleUpdateBudget} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Budget Amount</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  {submitting ? 'Updating...' : 'Update Budget'}
                </button>
              </form>
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