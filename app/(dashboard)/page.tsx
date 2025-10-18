// app/dashboard/page.tsx

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Loader } from "lucide-react"; // أيقونة للتحميل

// مكونات الواجهة - سننشئها في الخطوات التالية
import { QuickActions } from "@/components/Dashboard/QuickActions";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { EnrollmentChart } from "@/components/Dashboard/EnrollmentChart";
import { VideoEngagementChart } from "@/components/Dashboard/VideoEngagementChart";
import { SupportMessagesChart } from "@/components/Dashboard/SupportMessagesChart";

// استيراد الأنواع
import { Purchase } from "@/types/types";
import PaymentsCard from "@/components/Dashboard/PaymentsCard";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    unenrolledUsers: 0,
    videos: 0,
    users: 0,
    support: 0,
  });
  const [recentPurchases, setRecentPurchases] = useState<Purchase[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Promise.all لجلب كل البيانات بالتوازي لتحسين الأداء
        const [
          unenrolledRes, // <-- استبدل coursesCountRes بهذا
          videosCountRes,
          enrolledCountRes,
          supportCountRes,
          enrollmentRes,
          recentPurchasesRes,
        ] = await Promise.all([
          // 1. جلب الإحصائيات الأساسية
          supabase.rpc("get_unenrolled_users_count"), 
          supabase
            .from("course_videos")
            .select("*", { count: "exact", head: true }),
          supabase.from("user_roles").select("id", { count: "exact", head: true }).eq("role_id","3"),
          supabase
            .from("support_messages")
            .select("id", { count: "exact", head: true }).neq("status", "resolved"),
          supabase.rpc("get_daily_enrollments", { days: 30 }), // دالة تجلب عدد المسجلين يوميًا لآخر 30 يوم
          supabase
            .from("purchases_with_users")
            .select("*")
            .order("purchased_at", { ascending: false })
            .limit(5),
        ]);

        // التعامل مع أخطاء كل طلب على حدة
       if (unenrolledRes.error) throw unenrolledRes.error;
        if (videosCountRes.error) throw videosCountRes.error;
        if (enrolledCountRes.error) throw enrolledCountRes.error;
        if (supportCountRes.error) throw supportCountRes.error;
        if (enrollmentRes.error) throw enrollmentRes.error;

        // تحديث حالة الإحصائيات
        setStats({
          unenrolledUsers: unenrolledRes.data ?? 0, // <-- تحديث هنا
          videos: videosCountRes.count ?? 0,
          users: enrolledCountRes.count ?? 0,
          support: supportCountRes.count ?? 0,
        });

        setRecentPurchases(recentPurchasesRes.data as Purchase[]);
      } catch (err: unknown) {
        console.error("Error fetching dashboard data:", err);
        setError("فشل في تحميل بيانات لوحة التحكم. الرجاء المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-8 bg-background">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          لوحة التحكم
        </h1>
        <QuickActions />
      </div>

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EnrollmentChart />
        </div>
        <PaymentsCard purchases={recentPurchases} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <VideoEngagementChart />
        </div>
        <div className="lg:col-span-2">
          <SupportMessagesChart />
        </div>
      </div>
    </div>
  );
}
