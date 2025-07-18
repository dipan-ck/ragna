import React from 'react';
import { Database, Zap, FileText } from 'lucide-react';

type Usage = {
    filesUploaded: number;
    projectsCreated: number;
    tokensUsed: number;
};

type AnalyticsProps = {
    usage: Usage;
};

const Analytics: React.FC<AnalyticsProps> = ({ usage }) => {
    const analyticsData = [
        {
            title: 'Total Projects',
            value: usage.projectsCreated.toString(),
            subtitle: 'Active and inactive',
            icon: <Database className="h-6 w-6 text-[#2194FF] " />,
            change: '+20% vs last month',
            changeColor: 'text-[#2194FF]',
        },
        {
            title: 'Tokens Used',
            value: usage.tokensUsed >= 1000 ? `${(usage.tokensUsed / 1000).toFixed(1)}K` : usage.tokensUsed.toString(),
            subtitle: 'This month',
            icon: <Zap className="h-6 w-6 text-[#2194FF] " />,
            change: '+15% vs last month',
            changeColor: 'text-[#2194FF]',
        },
        {
            title: 'Files Uploaded',
            value: usage.filesUploaded.toString(),
            subtitle: 'Total processed',
            icon: <FileText className="h-6 w-6 text-[#2194FF] " />,
            change: '+8% vs last month',
            changeColor: 'text-[#2194FF]',
        },
        {
            title: 'Current Plan',
            value: 'Free',
            subtitle: '2.4K tokens remaining',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#1c3eff] ">
                    <rect width="24" height="24" rx="4" fill="currentColor" />
                </svg>
            ),
            change: '',
            changeColor: '',
        },
    ];

    return (
        <div className="grid grid-cols-1 w-[90%] md:grid-cols-4 gap-4">
            {analyticsData.map((card) => (
                <div
                    key={card.title}
                    className="bg-[#0A0A0A]  border-[1px] border-[#2a2a2a] rounded-xl p-4 flex flex-col gap-3"
                >
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-base tracking-tight font-medium text-white">{card.title}</span>
                            <span className="text-2xl font-semibold text-[#B8B8B8] mt-0.5">{card.value}</span>
                        </div>
                        <div className="bg-[#161616] p-2 rounded-lg">
                            {card.icon}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-400">{card.subtitle}</span>
                        {card.change && (
                            <span className={`text-sm ${card.changeColor}`}>
                                {card.change}
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Analytics;
