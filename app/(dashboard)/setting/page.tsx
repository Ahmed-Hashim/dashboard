import { createClient } from "@/lib/server";
import { Tables } from "@/types/database";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Calendar,
  Shield,
  TrendingUp,
  DollarSign,
  Users,
  BookOpen,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { redirect } from "next/navigation";

export default async function AdminProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // جلب بيانات البروفايل
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // جلب بيانات الأدمن/السيلز
  const { data: userRoles } = await supabase
    .from("user_roles")
    .select(
      `
      id,
      role_id,
      roles (name)
    `
    )
    .eq("user_id", user.id)
    .single();

  // جلب إحصائيات المبيعات (للسيلز/أدمن)
  const { data: salesStats } = await supabase
    .from("purchases")
    .select("amount, status, purchased_at")
    .eq("status", "succeeded");

  // جلب عدد المستخدمين المسجلين
  const { data: usersCount } = await supabase
    .from("profiles")
    .select("id", { count: "exact" });

  // جلب عدد الكورسات
  const { data: coursesCount } = await supabase
    .from("courses")
    .select("id", { count: "exact" });

  // جلب آخر المبيعات
  const { data: recentPurchases } = await supabase
    .from("purchases_with_users")
    .select("*")
    .order("purchased_at", { ascending: false })
    .limit(5);

  // حساب الإحصائيات
  const totalRevenue =
    salesStats?.reduce((sum, purchase) => sum + purchase.amount, 0) || 0;
  const totalSales = salesStats?.length || 0;
  const totalUsers = usersCount?.length || 0;
  const totalCourses = coursesCount?.length || 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "succeeded":
        return <Badge className="bg-green-100 text-green-800">ناجح</Badge>;
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">قيد الانتظار</Badge>
        );
      case "failed":
        return <Badge className="bg-red-100 text-red-800">فاشل</Badge>;
      default:
        return <Badge>غير معروف</Badge>;
    }
  };

  const getRoleBadge = (roleName: string) => {
    switch (roleName) {
      case "admin":
        return <Badge className="bg-purple-100 text-purple-800">أدمن</Badge>;
      case "sales":
        return <Badge className="bg-blue-100 text-blue-800">سيلز</Badge>;
      case "instructor":
        return <Badge className="bg-green-100 text-green-800">مدرب</Badge>;
      default:
        return <Badge>مستخدم</Badge>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6" dir="rtl">
      {/* الهيدر */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">👤 الملف الشخصي</h1>
          <p className="text-gray-600 mt-2">
            نظرة عامة على حسابك وإحصائيات النظام
          </p>
        </div>
        <div className="flex items-center gap-3">
          {userRoles?.roles && getRoleBadge(userRoles?.roles?.[0]?.name || "")}
          <Button variant="outline">تعديل الملف الشخصي</Button>
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="overview" className="space-y-6" dir="rtl">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="stats">الإحصائيات</TabsTrigger>
          <TabsTrigger value="sales">المبيعات</TabsTrigger>
          <TabsTrigger value="profile">البيانات الشخصية</TabsTrigger>
        </TabsList>

        {/* تبويب النظرة العامة */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* إجمالي الإيرادات */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  إجمالي الإيرادات
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalRevenue.toLocaleString()} جنيه مصري
                </div>
                <p className="text-xs text-muted-foreground">
                  +20% من الشهر الماضي
                </p>
              </CardContent>
            </Card>

            {/* إجمالي المبيعات */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  إجمالي المبيعات
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSales}</div>
                <p className="text-xs text-muted-foreground">
                  +12% من الشهر الماضي
                </p>
              </CardContent>
            </Card>

            {/* المستخدمين */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  المستخدمين
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-xs text-muted-foreground">+4 مستخدمين جدد</p>
              </CardContent>
            </Card>

            {/* الكورسات */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">الكورسات</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCourses}</div>
                <p className="text-xs text-muted-foreground">
                  {totalCourses} كورسات نشطة
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* آخر المبيعات */}
            <Card>
              <CardHeader>
                <CardTitle>آخر المبيعات</CardTitle>
                <CardDescription>أحدث 5 عمليات شراء في النظام</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPurchases?.map((purchase) => (
                    <div
                      key={purchase.id}
                      className="flex items-center justify-between border-b pb-3"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{purchase.user_email}</p>
                        <p className="text-sm text-gray-500">
                          {purchase.amount} جنيه مصري • {purchase.course_title}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(purchase.status || "pending")}
                        <span className="text-xs text-gray-500">
                          {new Date(
                            purchase.purchased_at || ""
                          ).toLocaleDateString("ar-EG")}
                        </span>
                      </div>
                    </div>
                  ))}
                  {!recentPurchases?.length && (
                    <p className="text-center text-gray-500 py-4">
                      لا توجد مبيعات حديثة
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* معلومات الحساب */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات الحساب</CardTitle>
                <CardDescription>تفاصيل حسابك في النظام</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback>
                      {profile?.name?.charAt(0) || user.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {profile?.name || "غير محدد"}
                    </h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Shield className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {userRoles?.roles?.[0]?.name || "مستخدم"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">حالة الحساب</span>
                    <Badge className="bg-green-100 text-green-800">نشط</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">تاريخ الإنشاء</span>
                    <span className="text-sm">
                      {new Date(user.created_at).toLocaleDateString("ar-EG")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">آخر نشاط</span>
                    <span className="text-sm">الآن</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* تبويب الإحصائيات */}
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>📊 إحصائيات مفصلة</CardTitle>
              <CardDescription>تحليلات وأرقام مفصلة عن النظام</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">إحصائيات المبيعات</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>المبيعات الناجحة</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{totalSales}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>قيد الانتظار</span>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <span>0</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>المبيعات الفاشلة</span>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span>0</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">إحصائيات المحتوى</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>إجمالي الكورسات</span>
                      <span>{totalCourses}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>الكورسات النشطة</span>
                      <span>{totalCourses}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>المستخدمين النشطين</span>
                      <span>{totalUsers}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب المبيعات */}
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>💰 إدارة المبيعات</CardTitle>
              <CardDescription>عرض وإدارة جميع عمليات الشراء</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPurchases?.map((purchase) => (
                  <Card key={purchase.id} className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">
                            {purchase.user_email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <BookOpen className="h-3 w-3" />
                          <span>{purchase.course_title}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">
                            جنيه مصري{purchase.amount}{" "}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(
                              purchase.purchased_at || ""
                            ).toLocaleDateString("ar-EG")}
                          </p>
                        </div>
                        {getStatusBadge(purchase.status || "pending")}
                      </div>
                    </div>
                  </Card>
                ))}
                {!recentPurchases?.length && (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">لا توجد مبيعات حتى الآن</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب البيانات الشخصية */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>البيانات الشخصية</CardTitle>
                <CardDescription>إدارة معلومات حسابك الشخصية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">الاسم الكامل</label>
                    <div className="p-2 border rounded-md">
                      {profile?.name || "غير محدد"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      البريد الإلكتروني
                    </label>
                    <div className="p-2 border rounded-md">{user.email}</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <label className="text-sm font-medium">معرف المستخدم</label>
                  <div className="p-2 border rounded-md font-mono text-sm">
                    {user.id}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      تاريخ إنشاء الحساب
                    </label>
                    <div className="p-2 border rounded-md flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {new Date(user.created_at).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">الدور</label>
                    <div className="p-2 border rounded-md flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-400" />
                      {userRoles?.roles?.[0]?.name || "مستخدم"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الإجراءات السريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Mail className="h-4 w-4 ml-2" />
                  تغيير البريد الإلكتروني
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Shield className="h-4 w-4 ml-2" />
                  إدارة الصلاحيات
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <User className="h-4 w-4 ml-2" />
                  تحديث الصورة الشخصية
                </Button>
                <Separator />
                <Button className="w-full justify-start" variant="destructive">
                  <XCircle className="h-4 w-4 ml-2" />
                  حذف الحساب
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
