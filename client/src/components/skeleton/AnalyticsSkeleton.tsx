'use client';

import React from 'react';

const AnalyticsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 w-[90%] md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, idx) => (
        <div
          key={idx}
          className="bg-[#0A0A0A] border-[1px] border-[#2a2a2a] rounded-xl p-4 flex flex-col gap-3 animate-pulse"
        >
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <div className="h-4 w-24 bg-[#1a1a1a] rounded" />
              <div className="h-6 w-16 bg-[#1a1a1a] rounded" />
            </div>
            <div className="bg-[#161616] p-2 rounded-lg">
              <div className="w-6 h-6 bg-[#1a1a1a] rounded" />
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <div className="h-3 w-28 bg-[#1a1a1a] rounded" />
            <div className="h-3 w-16 bg-[#1a1a1a] rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsSkeleton;
