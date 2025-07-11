'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Navigation } from '@/components/dashboard/Navigation';
import { PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Subscription type
interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  billing_cycle: string;
  next_payment: string;
  status: string;
}

type SubscriptionsContentProps = {
  user: { id: string; name?: string; email: string };
};

export function SubscriptionsContent({ user }: SubscriptionsContentProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    amount: '',
    billing_cycle: 'Monthly',
    next_payment: '',
  });
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Fetch subscriptions on mount
  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      setError('');
      console.log('Fetching subscriptions for user:', user.id);
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('next_payment', { ascending: true });
      console.log('Supabase response:', { data, error });
      if (error) {
        console.error('Supabase error:', error);
        setError(error.message);
      }
      setSubscriptions(data || []);
      setLoading(false);
    };
    fetchSubscriptions();
  }, [user.id]);

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Add subscription
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setError('');
    const newSub = {
      user_id: user.id,
      name: form.name,
      amount: parseFloat(form.amount),
      currency: 'USD',
      billing_cycle: form.billing_cycle,
      next_payment: form.next_payment,
      status: 'active',
    };
    // Optimistic UI
    const tempId = 'temp-' + Math.random();
    setSubscriptions((subs) => [
      { ...newSub, id: tempId },
      ...subs,
    ]);
    setShowAddModal(false);
    setForm({ name: '', amount: '', billing_cycle: 'Monthly', next_payment: '' });
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([newSub])
      .select()
      .single();
    setAdding(false);
    if (error) {
      setToast('Failed to add subscription');
      setSubscriptions((subs) => subs.filter((s) => s.id !== tempId));
    } else {
      setToast('Subscription added');
      setSubscriptions((subs) => [data, ...subs.filter((s) => s.id !== tempId)]);
    }
  };

  // Delete subscription
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    // Optimistic UI
    const prev = subscriptions;
    setSubscriptions((subs) => subs.filter((s) => s.id !== id));
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id);
    setDeletingId(null);
    if (error) {
      setToast('Failed to delete');
      setSubscriptions(prev); // revert
    } else {
      setToast('Deleted');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
            <p className="text-gray-600 mt-2">Manage your recurring subscriptions</p>
          </div>
          <button
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center space-x-2"
            onClick={() => setShowAddModal(true)}
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Subscription</span>
          </button>
        </div>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {subscriptions.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">No subscriptions found.</div>
            ) : (
              subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 p-6 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{sub.name}</h3>
                    <div className="text-sm text-gray-600 mb-2">{sub.billing_cycle}</div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Amount</span>
                      <span className="font-semibold text-gray-900">${sub.amount} {sub.currency}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Next Payment</span>
                      <span className="text-gray-900">{sub.next_payment ? new Date(sub.next_payment).toLocaleDateString() : '-'}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Status</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">{sub.status}</span>
                    </div>
                  </div>
                  <button
                    className="mt-4 flex items-center justify-center text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(sub.id)}
                    disabled={deletingId === sub.id}
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5 mr-1" />
                    {deletingId === sub.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {/* Add Subscription Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowAddModal(false)}
              title="Close"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold mb-4">Add Subscription</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount (USD)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Billing Cycle</label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={form.billing_cycle}
                  onChange={e => setForm(f => ({ ...f, billing_cycle: e.target.value }))}
                  required
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Next Payment Date</label>
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={form.next_payment}
                  onChange={e => setForm(f => ({ ...f, next_payment: e.target.value }))}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 mt-2"
                disabled={adding}
              >
                {adding ? 'Adding...' : 'Add Subscription'}
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
  );
} 