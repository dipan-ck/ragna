'use client';

import { useUser } from '@/lib/hooks/useUser';
import { Database, FileText, Zap, Gem } from 'lucide-react';
import AnalyticsSkeleton from '../skeleton/AnalyticsSkeleton';

interface Usage {
  tokensUsed: number;
  filesUploaded: number;
  projectsCreated: number;
}

interface User {
  email: string;
  fullName: string;
  isVerified: boolean;
  avatar: string;
  usage: Usage;
  subscriptionStatus: string;
  plan: 'free' | 'pro' | 'business';
}



const cardStyles =
  'bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl p-4 flex flex-col justify-between transition hover:shadow-md hover:border-[#3A3A3A]';

export default function Analytics({fetchedUser}) {
  const { data: user, isLoading } = useUser(fetchedUser);

  if (isLoading || !user?.usage) {
    return <AnalyticsSkeleton />;
  }

  const analyticsData = [
    {
      title: 'Total Projects',
      value: `${user.usage.projectsCreated}`,
      subtitle: 'Unlimited allowed',
      icon: <Database className="h-6 w-6 text-[#2194FF]" />,
    },
    {
      title: 'Files Uploaded',
      value: `${user.usage.filesUploaded}`,
      subtitle: 'Unlimited allowed',
      icon: <FileText className="h-6 w-6 text-[#2194FF]" />,
    },
    {
      title: 'Tokens Used',
      value:
        user.usage.tokensUsed >= 1000
          ? `${(user.usage.tokensUsed / 1000).toFixed(1)}K`
          : `${user.usage.tokensUsed}`,
      subtitle: 'Unlimited usage',
      icon: <Zap className="h-6 w-6 text-[#2194FF]" />,
    },
    {
      title: 'Current Plan',
      value: user.plan.charAt(0).toUpperCase() + user.plan.slice(1),
      subtitle: 'All features unlocked',
      icon: <Gem className="h-6 w-6 text-[#2194FF]" />, // gold icon
    },
  ];

  return (
    <div className="w-[90%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto mt-2">
      {analyticsData.map((card) => (
        <div key={card.title} className={cardStyles}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">{card.title}</span>
              <span className="text-2xl font-semibold text-[#B8B8B8] mt-1">{card.value}</span>
            </div>
            <div className="bg-[#161616] p-2 rounded-lg">{card.icon}</div>
          </div>
          <span className="text-xs text-[#2194FF]">{card.subtitle}</span>
        </div>
      ))}
    </div>
  );
}
