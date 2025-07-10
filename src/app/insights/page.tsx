"use client";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthProvider';
import { InsightsContent } from '@/components/insights/InsightsContent';

export default function InsightsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  return <InsightsContent user={user} />;
} 