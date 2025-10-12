import { createClient } from "@/lib/server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Edit, Phone, MapPin, KeyRound } from "lucide-react";
import { redirect } from "next/navigation";

// Import the new interactive components
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog";
import { ChangePasswordDialog } from "@/components/profile/change-password-dialog";

// Re-using the InfoField component from the previous refinement
interface InfoFieldProps {
  icon: React.ElementType;
  value?: string | null;
  placeholder?: string;
}

const InfoField: React.FC<InfoFieldProps> = ({
  icon: Icon,
  value,
  placeholder = "غير محدد",
}) => (
  <div className="flex items-center gap-2 p-3 border border-border rounded-lg bg-secondary/50">
    <Icon className="h-4 w-4 text-muted-foreground" />
    {value ? (
      <span className="text-foreground">{value}</span>
    ) : (
      <span className="text-muted-foreground">{placeholder}</span>
    )}
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
  }

  const profile = userData.profile;
  const userRoleName = userData.role;


  const getRoleBadge = (roleName: string) => {
    switch (roleName) {
      case "admin":
        return <Badge variant="destructive">مسؤول النظام</Badge>;
      default:
        return <Badge variant="secondary">مستخدم</Badge>;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            👤 الملف الشخصي
          </h1>
          <p className="text-muted-foreground mt-2">
            إدارة معلومات حسابك الشخصية وتفضيلاتك
          </p>
        </div>

        {/* Main Edit Button now opens the dialog */}
        <EditProfileDialog profile={profile} user={user}>
          <Button className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            تعديل الملف الشخصي
          </Button>
        </EditProfileDialog>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="text-lg bg-gradient-to-br from-primary/20 to-secondary">
                    {profile?.name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-foreground">
                    {profile?.name || "غير محدد"}
                  </h2>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                  <div className="flex justify-center">
                    {getRoleBadge(userRoleName)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                المعلومات الشخصية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoField icon={User} value={profile?.name} />
              <InfoField icon={Mail} value={user.email} />
              <InfoField icon={Phone} placeholder="لم يتم إضافته" />
              <InfoField icon={MapPin} placeholder="لم يتم إضافته" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">
                الإجراءات والأمان
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Edit personal data button */}
                <EditProfileDialog profile={profile} user={user}>
                  <Button
                    variant="outline"
                    className="justify-start gap-2 h-12"
                  >
                    <Edit className="h-4 w-4" />
                    تعديل البيانات الشخصية
                  </Button>
                </EditProfileDialog>

                {/* Change password button */}
                <ChangePasswordDialog>
                  <Button
                    variant="outline"
                    className="justify-start gap-2 h-12"
                  >
                    <KeyRound className="h-4 w-4" />
                    تغيير كلمة المرور
                  </Button>
                </ChangePasswordDialog>

                {/* Note: Email change is complex due to Supabase confirmation flow.
                    It's often handled on a separate, dedicated settings page.
                    For simplicity, it's omitted here but would follow a similar pattern. */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
