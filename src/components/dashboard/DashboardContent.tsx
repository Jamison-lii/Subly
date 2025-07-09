'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';
import { Navigation } from './Navigation';
import { OverviewCards } from './OverviewCards';
import { UpcomingPayments } from './UpcomingPayments';
import { InsightsPanel } from './InsightsPanel';
import { BudgetWidget } from './BudgetWidget';

export function DashboardContent() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    // Get user data from local storage
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      router.push('/auth/login');
    }
    setIsLoading(false);
  }, [router]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name}
          </h1>
          <p className="text-gray-600 mt-2">
            Here&apos;s a summary of your subscriptions and spending.
          </p>
        </div>

        {/* Top Summary Cards */}
        <div className="mb-8">
          <OverviewCards />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Overview & Upcoming Payments */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Charges Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Upcoming Charges
              </h2>
              <UpcomingPayments />
            </div>
          </div>

          {/* Right Column - AI Insights & Budget */}
          <div className="space-y-8">
            {/* AI Insights Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <InsightsPanel />
            </div>

            {/* Budget Widget */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <BudgetWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 