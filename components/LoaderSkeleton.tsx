"use client";

export const LoaderSkeleton = ({ className = "h-80 w-full" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
);
