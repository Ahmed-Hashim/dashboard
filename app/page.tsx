"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

import { QuickActions } from "@/components/Dashboard/QuickActions";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";

import { LoaderSkeleton } from "@/components/LoaderSkeleton";
import {
  CompletionVsActiveData,
  EnrollmentData,
  ProgressDistributionData,
  SupportMessagesData,
  VideoDropOffData,
  VideoEngagementData,
} from "@/types/types";
import { EnrollmentChart } from "@/components/Dashboard/EnrollmentChart";
import { CompletionVsActiveChart } from "@/components/Dashboard/CompletionVsActiveChart";
import { SupportMessagesChart } from "@/components/Dashboard/SupportMessagesChart";
import { VideoDropOffChart } from "@/components/Dashboard/VideoDropOffChart";
import { VideoEngagementChart } from "@/components/Dashboard/VideoEngagementChart";
import CardList from "@/components/Dashboard/Payments";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    courses: 0,
    videos: 0,
    users: 0,
    support: 0,
  });
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentData[]>([]);
  const [videoData, setVideoData] = useState<VideoEngagementData[]>([]);
  const [progressData, setProgressData] = useState<ProgressDistributionData[]>(
    []
  );
  const [supportData, setSupportData] = useState<SupportMessagesData[]>([]);
  const [completionData, setCompletionData] = useState<
    CompletionVsActiveData[]
  >([]);
  const [dropOffData, setDropOffData] = useState<VideoDropOffData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // هنا ممكن تجيب البيانات من Supabase لكل Chart
      // مثال وهمي للـ Dashboard
      setStats({ courses: 12, videos: 50, users: 200, support: 10 });
      setEnrollmentData([
        { date: "01/10", students: 10 },
        { date: "02/10", students: 20 },
        { date: "03/10", students: 25 },
      ]);
      setVideoData([
        { title: "فيديو 1", views: 50, avgWatchTime: 5 },
        { title: "فيديو 2", views: 30, avgWatchTime: 3 },
      ]);
      setProgressData([
        { name: "أنهو الكورس", value: 40 },
        { name: "في منتصف الكورس", value: 30 },
        { name: "بدأ فقط", value: 30 },
      ]);
      setSupportData([
        { date: "01/10", messages: 2 },
        { date: "02/10", messages: 5 },
      ]);
      setCompletionData([
        { date: "01/10", completionRate: 30, activeStudents: 50 },
        { date: "02/10", completionRate: 40, activeStudents: 60 },
      ]);
      setDropOffData([
        { time: 1, watchRate: 90 },
        { time: 2, watchRate: 70 },
      ]);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const [
        coursesCount,
        videosCount,
        usersCount,
        supportCount,
        coursesData,
        supportData,
      ] = await Promise.all([
        supabase.from("courses").select("*", { count: "exact", head: true }),
        supabase.from("videos").select("*", { count: "exact", head: true }),
        supabase.from("users").select("*", { count: "exact", head: true }),
        supabase.from("support").select("*", { count: "exact", head: true }),
        supabase
          .from("courses")
          .select("*")
          .order("views", { ascending: false })
          .limit(5),
        supabase
          .from("support")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      setStats({
        courses: coursesCount.count || 0,
        videos: videosCount.count || 0,
        users: usersCount.count || 0,
        support: supportCount.count || 0,
      });

      setSupportData(supportData.data || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSendMail = (email: string) => {
    alert(`إرسال بريد إلى ${email} (وظيفة تجريبية)`);
  };

  if (loading)
    return (
      <div className="space-y-6 p-6">
        <LoaderSkeleton className="h-10 w-32" />
        <LoaderSkeleton />
        <LoaderSkeleton />
        <LoaderSkeleton />
      </div>
    );

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold">لوحة التحكم</h1>
      <QuickActions />
      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <EnrollmentChart data={enrollmentData} />
        <div className="bg-primary-foreground p-4 rounded-lg">
          <CardList  />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <VideoEngagementChart data={videoData} />
        <SupportMessagesChart data={supportData} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CompletionVsActiveChart data={completionData} />
        <VideoDropOffChart data={dropOffData} />
      </div>
    </div>
  );
}
