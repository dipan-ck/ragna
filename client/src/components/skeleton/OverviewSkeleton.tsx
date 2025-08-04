'use client';

const SkeletonCard = () => (
  <div className="p-4 bg-[#0A0A0A] rounded-xl border border-[#2a2a2a] flex flex-col gap-2">
    <div className="h-4 w-1/3 rounded bg-gray-800 animate-shimmer" />
    <div className="h-6 w-1/2 rounded bg-gray-700 animate-shimmer" />
  </div>
);

const OverviewSectionSkeleton = () => {
  return (
    <div className="w-full p-8 bg-black text-white">
      {/* Title */}
      <div className="h-8 w-1/4 mb-6 rounded bg-gray-700 animate-shimmer" />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        {Array.from({ length: 5 }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>

      {/* API Endpoint */}
      <div className="mb-6">
        <div className="h-4 w-24 mb-2 rounded bg-gray-800 animate-shimmer" />
        <div className="h-10 w-full rounded bg-gray-800 animate-shimmer" />
      </div>

      {/* API Key */}
      <div className="mb-4">
        <div className="h-4 w-20 mb-2 rounded bg-gray-800 animate-shimmer" />
        <div className="h-10 w-full rounded bg-gray-800 animate-shimmer" />
        <div className="flex justify-end mt-2">
          <div className="h-6 w-24 rounded bg-gray-700 animate-shimmer" />
        </div>
      </div>

      {/* JS API Example Card */}
      <div className="h-40 w-full rounded-lg bg-gray-800 animate-shimmer" />
    </div>
  );
};

export default OverviewSectionSkeleton;
