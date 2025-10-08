import { createClient } from "@/lib/server";
import { Tables } from "@/types/database";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Mail, 
  Calendar,
  Shield,
  Edit,
  Phone,
  MapPin,
  KeyRound
} from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

type Profile = Tables<"profiles">;

// A reusable component for displaying a piece of information, styled like a read-only input.
const InfoField = ({ 
  icon: Icon, 
  label, 
  value,
  placeholder = "غير محدد"
}: { 
  icon: React.ElementType, 
  label: string, 
  value?: string | null,
  placeholder?: string
}) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <div className="flex h-10 w-full items-center gap-x-3 rounded-md border border-input bg-background px-3 py-2 text-sm">
      <Icon className="h-4 w-4 text-muted-foreground" />
      {value ? (
        <span className="text-foreground">{value}</span>
      ) : (
        <span className="text-muted-foreground">{placeholder}</span>
      )}
    </div>
  </div>
);


export default async function UserProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: userData, error } = await supabase.rpc("get_user_data");

  if (error) {
    console.error("Failed to fetch user data with RPC function:", error);
    // Optionally handle the error in the UI
  }

  const profile = userData?.profile as Profile | null;
  const userRoleName = userData?.role?.roles?.name;

  const getRoleBadge = (roleName?: string) => {
    switch (roleName) {
      case "admin":
        return <Badge variant="destructive">مسؤول النظام</Badge>;
      case "sales":
        return <Badge>فريق المبيعات</Badge>;
      case "instructor":
        return <Badge className="bg-green-600 hover:bg-green-700">مدرب</Badge>;
      default:
        return <Badge variant="secondary">مستخدم</Badge>;
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-8" dir="rtl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">الملف الشخصي</h1>
          <p className="text-muted-foreground mt-1">
            عرض وإدارة معلومات حسابك الشخصية.
          </p>
        </div>
        <Button>
          <Edit className="h-4 w-4 me-2" />
          تعديل الملف الشخصي
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar and Quick Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                  <AvatarImage src={profile?.avatar_url || ""} alt={profile?.name || "User Avatar"} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/20 to-secondary">
                    {profile?.name?.charAt(0) || user.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold text-foreground">
                    {profile?.name || "اسم المستخدم"}
                  </h2>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                  <div className="pt-2">
                    {getRoleBadge(userRoleName)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>معلومات سريعة</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm">
                  <div className="flex items-center justify-center h-8 w-8 bg-primary/10 rounded-full">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground">تاريخ التسجيل</p>
                    <p className="font-medium text-foreground">
                      {new Date(user.created_at).toLocaleDateString("ar-EG", { year: 'numeric', month: 'long' })}
                    </p>
                  </div>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <div className="flex items-center justify-center h-8 w-8 bg-green-500/10 rounded-full">
                    <Shield className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-muted-foreground">حالة الحساب</p>
                    <Badge variant="outline" className="text-green-600 border-green-400">نشط</Badge>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>المعلومات الشخصية</CardTitle>
              <CardDescription>البيانات الأساسية التي تعرف بها عن نفسك في النظام.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField icon={User} label="الاسم الكامل" value={profile?.name} />
                <InfoField icon={Mail} label="البريد الإلكتروني" value={user.email} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField icon={Phone} label="رقم الهاتف" placeholder="لم يتم إضافته" />
                <InfoField icon={MapPin} label="العنوان" placeholder="لم يتم إضافته" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إعدادات الحساب</CardTitle>
              <CardDescription>تفاصيل تعريفية وإعدادات الأمان الخاصة بحسابك.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium text-foreground">معرف المستخدم</p>
                    <p className="text-sm text-muted-foreground font-mono">{user.id}</p>
                  </div>
                  <Badge variant="outline" className="mt-2 sm:mt-0">فريد</Badge>
                </li>
                <li className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium text-foreground">الدور في النظام</p>
                    <p className="text-sm text-muted-foreground">{userRoleName || 'مستخدم'}</p>
                  </div>
                  <Shield className="h-5 w-5 text-muted-foreground" />
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>الإجراءات</CardTitle>
              <CardDescription>أدوات سريعة لإدارة حسابك.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start gap-2">
                  <User className="h-4 w-4" />
                  تحديث البيانات
                </Button>
                <Button variant="outline" className="justify-start gap-2">
                  <Mail className="h-4 w-4" />
                  تغيير البريد
                </Button>
                <Button variant="outline" className="justify-start gap-2">
                  <KeyRound className="h-4 w-4" />
                  تغيير كلمة المرور
                </Button>
                <Button variant="outline" className="justify-start gap-2">
                  <Shield className="h-4 w-4" />
                  إعدادات الأمان
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}