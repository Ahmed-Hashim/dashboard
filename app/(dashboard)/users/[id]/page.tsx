// app/(dashboard)/users/[id]/page.tsx
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/server";

interface UserDetailsPageProps {
  params: { id: string };
}

// ✅ التغيير هنا: استخلاص الـ params مباشرة من الوسيط
export default async function UserDetailsPage({ params }: UserDetailsPageProps) {


  const { id } = await params
  if (!id) return <div className="p-6 text-center">لم يتم تمرير معرف المستخدم.</div>;

  const supabase = await createClient();

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", id)
    .single();

  // Fetch role
  let role = null;
  const { data: userRole } = await supabase
    .from("user_roles")
    .select("*")
    .eq("user_id", id)
    .single();

  if (userRole?.role_id) {
    const { data } = await supabase
      .from("roles")
      .select("*")
      .eq("id", userRole.role_id)
      .single();
    role = data;
  }

  if (!profile) return <div className="p-6 text-center">لم يتم العثور على المستخدم.</div>;

  return (
    <div dir="rtl" className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <CardTitle className="text-2xl font-bold">تفاصيل المستخدم</CardTitle>
        <Link href="/users">
          <Button variant="outline" className="flex items-center gap-1">
            <ArrowRight className="w-4 h-4" />
            العودة للقائمة
          </Button>
        </Link>
      </div>

      <Card className="shadow">
        <CardContent className="space-y-6">
          {/* Avatar and Name */}
          <div className="flex items-center gap-4">
            <Avatar className="w-24 h-24">
              {profile.avatar_url ? (
                <Image width={96} height={96} src={profile.avatar_url} alt={profile.name ?? "avatar"} />
              ) : (
                <span className="text-xl font-medium">{(profile.name ?? "—").slice(0, 1)}</span>
              )}
            </Avatar>
            <div className="text-right space-y-1">
              <h2 className="text-xl font-semibold">{profile.name ?? "—"}</h2>
              <p className="text-muted-foreground">{profile.email ?? "—"}</p>
              {role ? (
                <Badge className="mt-1">{role.name}</Badge>
              ) : (
                <Badge variant="secondary" className="mt-1">بدون دور</Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Profile Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-right">
            <p><strong>معرف المستخدم:</strong> {profile.user_id}</p>
            <p><strong>اسم المستخدم:</strong> {profile.username ?? "-"}</p>
            <p><strong>سيرة ذاتية:</strong> {profile.bio ?? "-"}</p>
            <p>
              <strong>الموقع الإلكتروني:</strong>{" "}
              {profile.website ? (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="underline">
                  {profile.website}
                </a>
              ) : "-"}
            </p>
            <p><strong>الموقع:</strong> {profile.location ?? "-"}</p>
            <p><strong>الهاتف:</strong> {profile.phone ?? "-"}</p>
            <p><strong>تاريخ الإنشاء:</strong> {profile.created_at ? new Date(profile.created_at).toLocaleString() : "-"}</p>
            <p><strong>آخر تحديث:</strong> {profile.updated_at ? new Date(profile.updated_at).toLocaleString() : "-"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}