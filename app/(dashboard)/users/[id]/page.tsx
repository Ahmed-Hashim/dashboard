// app/(dashboard)/users/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Tables } from "@/types/database";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

type Profile = Tables<"profiles">;
type Role = Tables<"roles">;
type UserRole = Tables<"user_roles">;

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  const userId = params.id;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      const { data: userRole } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", userId)
        .single();

      let roleData: Role | null = null;
      if (userRole?.role_id) {
        const { data } = await supabase
          .from("roles")
          .select("*")
          .eq("id", userRole.role_id)
          .single();
        roleData = data;
      }

      setProfile(profileData);
      setRole(roleData);
      setLoading(false);
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div className="p-6 text-center">جارٍ التحميل...</div>;
  if (!profile) return <div className="p-6 text-center">لم يتم العثور على المستخدم.</div>;

  return (
    <div dir="rtl" className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">تفاصيل المستخدم</h1>
        <Link href="/dashboard/users">
          <Button variant="outline" className="flex items-center gap-1">
            <ArrowRight className="w-4 h-4" />
            العودة للقائمة
          </Button>
        </Link>
      </div>

      <div className="bg-card rounded-lg p-6 shadow">
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20">
            {profile.avatar_url ? (
              <Image width={100} height={100} src={profile.avatar_url} alt={profile.name ?? "avatar"} />
            ) : (
              <span className="text-lg font-medium">
                {(profile.name ?? "—").slice(0, 1)}
              </span>
            )}
          </Avatar>

          <div className="text-right">
            <h2 className="text-xl font-semibold">{profile.name ?? "—"}</h2>
            <p className="text-muted-foreground">{profile.email ?? "—"}</p>
            {role ? (
              <Badge className="mt-2">{role.name}</Badge>
            ) : (
              <Badge variant="secondary" className="mt-2">بدون دور</Badge>
            )}
          </div>
        </div>

        <div className="border-t mt-6 pt-4 space-y-2 text-right">
          <p><strong>معرف المستخدم:</strong> {profile.user_id}</p>
          <p><strong>تاريخ الإنشاء:</strong> {profile.created_at ? new Date(profile.created_at).toLocaleString() : "-"}</p>
          
        </div>
      </div>
    </div>
  );
}
