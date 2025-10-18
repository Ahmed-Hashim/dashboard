"use client";

import { StatsCard } from "@/components/StatsCard";

interface Stats {
  unenrolledUsers: number;
  videos: number;
  users: number;
  support: number;
}

interface DashboardStatsProps {
  stats: Stats;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
    <StatsCard
      title="المستخدمين المحتملين"
      value={stats.unenrolledUsers}
      color="from-indigo-500 to-indigo-600"
    />
    <StatsCard
      title="عدد الفيديوهات"
      value={stats.videos}
      color="from-purple-500 to-purple-600"
    />
    <StatsCard
      title="عدد المشتركين"
      value={stats.users}
      color="from-green-500 to-green-600"
    />
    <StatsCard
      title="رسائل الدعم الجديدة"
      value={stats.support}
      color="from-red-500 to-red-600"
    />
  </div>
);
