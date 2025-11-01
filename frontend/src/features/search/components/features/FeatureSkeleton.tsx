"use client";

export default function FeatureSkeleton() {
  return (
    <div className="p-5 bg-gray-100 rounded-2xl animate-pulse">
      <div className="h-5 bg-gray-300 rounded w-2/3 mb-3"></div>
      <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-4/5 mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
    </div>
  );
}
