'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton'; // If using a custom skeleton component
import { cn } from '@/lib/utils'; // Optional utility for className merging

const ProjectCardSkeleton: React.FC<{ idx: number }> = ({ idx }) => {
  return (
    <div
      className="bg-[#0A0A0A] border-[1px] border-[#2a2a2a] rounded-2xl p-6 flex flex-col gap-4 min-h-[180px] cursor-wait relative opacity-0 translate-y-4 animate-fadein"
      style={{ animationDelay: `${idx * 80}ms`, animationFillMode: 'forwards' }}
    >
      {/* Header */}
      <div className="absolute top-4 right-4 z-10">
        <div className="w-5 h-5 rounded-full bg-[#1a1a1a] animate-pulse" />
      </div>

      {/* Title */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex flex-col gap-2 w-full">
          <div className="h-4 w-2/3 bg-[#1a1a1a] rounded animate-pulse" />
          <div className="flex gap-2 mt-1">
            <div className="w-20 h-5 bg-[#1a1a1a] rounded-full animate-pulse" />
            <div className="w-14 h-5 bg-[#1a1a1a] rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <div className="w-4 h-4 bg-[#1a1a1a] rounded animate-pulse" />
          <div className="w-20 h-3 bg-[#1a1a1a] rounded animate-pulse" />
          <div className="ml-auto w-10 h-3 bg-[#1a1a1a] rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <div className="w-4 h-4 bg-[#1a1a1a] rounded animate-pulse" />
          <div className="w-20 h-3 bg-[#1a1a1a] rounded animate-pulse" />
          <div className="ml-auto w-16 h-3 bg-[#1a1a1a] rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ProjectCardSkeleton;
