'use client';

import { Navigation } from './Navigation';
import { OverviewCards } from './OverviewCards';
import { UpcomingPayments } from './UpcomingPayments';
import { InsightsPanel } from './InsightsPanel';
import { BudgetWidget } from './BudgetWidget';

type DashboardContentProps = {
  user: { name?: string; email: string };
};

export function DashboardContent({ user }: DashboardContentProps) {
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
            Welcome back, {user.name || user.email}
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