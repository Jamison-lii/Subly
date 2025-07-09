'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';
import { Navigation } from '@/components/dashboard/Navigation';
import { PlusIcon, FunnelIcon, MagnifyingGlassIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';

const subscriptions = [
  {
    id: 1,
    name: 'Netflix',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    amount: 9.99,
    billingCycle: 'Monthly',
    nextBilling: 'June 25, 2024',
    category: 'Entertainment',
    status: 'active',
    usage: 'Heavy',
    lastUsed: '2 days ago',
    color: 'bg-red-500'
  },
  {
    id: 2,
    name: 'Spotify Premium',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
    amount: 12.99,
    billingCycle: 'Monthly',
    nextBilling: 'June 27, 2024',
    category: 'Music',
    status: 'active',
    usage: 'Light',
    lastUsed: '2 weeks ago',
    color: 'bg-green-500'
  },
  {
    id: 3,
    name: 'Adobe Creative Cloud',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg',
    amount: 52.99,
    billingCycle: 'Monthly',
    nextBilling: 'June 30, 2024',
    category: 'Productivity',
    status: 'active',
    usage: 'Medium',
    lastUsed: '1 day ago',
    color: 'bg-orange-500'
  },
  {
    id: 4,
    name: 'GitHub Pro',
    logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    amount: 4.99,
    billingCycle: 'Monthly',
    nextBilling: 'July 2, 2024',
    category: 'Development',
    status: 'active',
    usage: 'Heavy',
    lastUsed: 'Today',
    color: 'bg-gray-800'
  },
  {
    id: 5,
    name: 'Notion Personal',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
    amount: 4.99,
    billingCycle: 'Monthly',
    nextBilling: 'July 5, 2024',
    category: 'Productivity',
    status: 'active',
    usage: 'Medium',
    lastUsed: '3 days ago',
    color: 'bg-black'
  },
  {
    id: 6,
    name: 'Hulu',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Hulu_Logo.svg',
    amount: 7.99,
    billingCycle: 'Monthly',
    nextBilling: 'June 28, 2024',
    category: 'Entertainment',
    status: 'active',
    usage: 'Light',
    lastUsed: '1 week ago',
    color: 'bg-green-600'
  }
];

export function SubscriptionsContent() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useState(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      router.push('/auth/login');
    }
    setIsLoading(false);
  });

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

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || sub.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(subscriptions.map(sub => sub.category))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
              <p className="text-gray-600 mt-2">
                Manage all your recurring subscriptions in one place
              </p>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2">
              <PlusIcon className="h-5 w-5" />
              <span>Add Subscription</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">{subscriptions.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 rounded"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Spend</p>
                <p className="text-2xl font-bold text-gray-900">$89.94</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <div className="w-6 h-6 bg-green-500 rounded"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Next Payment</p>
                <p className="text-2xl font-bold text-gray-900">$9.99</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <div className="w-6 h-6 bg-orange-500 rounded"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Savings Potential</p>
                <p className="text-2xl font-bold text-green-600">$47.99</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <div className="w-6 h-6 bg-green-500 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Subscriptions List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSubscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-xl ${subscription.color} flex items-center justify-center shadow-lg`}>
                      <img 
                        src={subscription.logo} 
                        alt={subscription.name}
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{subscription.name}</h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {subscription.category}
                      </span>
                    </div>
                  </div>
                  
                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    <EllipsisVerticalIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Amount</span>
                    <span className="font-semibold text-gray-900">${subscription.amount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Billing</span>
                    <span className="text-sm text-gray-900">{subscription.billingCycle}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Next Payment</span>
                    <span className="text-sm text-gray-900">{subscription.nextBilling}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Usage</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      subscription.usage === 'Heavy' ? 'bg-green-100 text-green-700' :
                      subscription.usage === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {subscription.usage}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Last used: {subscription.lastUsed}</span>
                    <div className="flex items-center space-x-2">
                      <button className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors">
                        Manage
                      </button>
                      <button className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 