"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";

type User = {
  id: string;
  full_name: string;
  email: string;
};

const currencyNames: Record<string, string> = {
  EGP: "جنيه مصري",
  USD: "دولار أمريكي",
  EUR: "يورو",
  SAR: "ريال سعودي",
  AED: "درهم إماراتي",
  KWD: "دينار كويتي",
  QAR: "ريال قطري",
};

export default function EnrollmentUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState("free");
  const [currency, setCurrency] = useState("EGP");
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control the dialog
  const courseId = 2; // Example course ID

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFiltered(users);
    } else {
      setFiltered(
        users.filter((u) =>
          u.full_name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, users]);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc(
      "get_available_users_for_enrollment",
      { course_id: courseId }
    );

    if (error) {
      console.error("Error fetching users:", error);
      toast.error("فشل في جلب قائمة المستخدمين.");
    } else {
      setUsers(data || []);
      setFiltered(data || []);
    }
    setLoading(false);
  };

  // ✨ --- UPDATED & SIMPLIFIED: Using Supabase RPC Function --- ✨
  const handleEnroll = async () => {
    if (!selectedUser) return;
    setSaving(true);

    try {
      // Prepare the parameters for our SQL function
      const params = {
        p_user_id: selectedUser.id,
        p_course_id: courseId,
        p_is_paid: paymentType === "paid",
        p_amount: paymentType === "paid" ? parseFloat(amount) : null,
        p_currency: paymentType === "paid" ? currency : null,
      };

      // Call the single SQL function that handles everything
      const {  error } = await supabase.rpc("enroll_user_in_course", params);

      if (error) {
        // Any error from the SQL function (like a RAISE EXCEPTION) will be caught here
        throw error;
      }
      
      // The function in SQL checks for existing enrollments, so we don't need to handle it here
      toast.success("تمت عملية الاشتراك بنجاح!");
      fetchUsers(); // Refresh the user list
      setIsDialogOpen(false); // Close the dialog on success

    } catch (err: unknown) {
      console.error("Enrollment RPC error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Internal Server Error";
      toast.error(`حدث خطأ أثناء الاشتراك: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 bg-background text-foreground">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">
          المستخدمين المتاحين للاشتراك
        </h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن المستخدم..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((user) => (
              <Card key={user.id} className="flex flex-col justify-between">
                <CardHeader>
                  <CardTitle className="text-lg">{user.full_name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </CardContent>
                <div className="p-4 pt-0">
                  {/* ✨ Control the Dialog state */}
                  <Dialog open={isDialogOpen && selectedUser?.id === user.id} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full"
                        onClick={() => {
                          setSelectedUser(user);
                          setAmount("");
                          setPaymentType("free");
                          setCurrency("EGP");
                          setIsDialogOpen(true); // Manually open dialog
                        }}
                      >
                        إضافة اشتراك
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>إضافة اشتراك للمستخدم</DialogTitle>
                      </DialogHeader>

                      <div className="space-y-4 py-4">
                        <div>
                          <p>
                            <span className="font-semibold">الاسم:</span>{" "}
                            {selectedUser?.full_name}
                          </p>
                          <p>
                            <span className="font-semibold">البريد الإلكتروني:</span>{" "}
                            {selectedUser?.email}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="paymentType">نوع الدفع</Label>
                          <Select
                            value={paymentType}
                            onValueChange={setPaymentType}
                          >
                            <SelectTrigger id="paymentType">
                              <SelectValue placeholder="اختر نوع الدفع" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free">مجاني</SelectItem>
                              <SelectItem value="paid">مدفوع</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {paymentType === "paid" && (
                          <div className="space-y-2">
                            <Label htmlFor="amount">المبلغ والعملة</Label>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="col-span-2">
                                <Input
                                  id="amount"
                                  type="number"
                                  placeholder="أدخل المبلغ..."
                                  value={amount}
                                  onChange={(e) => setAmount(e.target.value)}
                                />
                              </div>
                              <Select
                                onValueChange={setCurrency}
                                value={currency}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="العملة" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(currencyNames).map(
                                    ([code, name]) => (
                                      <SelectItem key={code} value={code}>
                                        {name}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                      </div>

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">إلغاء</Button>
                        </DialogClose>
                        <Button
                          onClick={handleEnroll}
                          disabled={saving || (paymentType === "paid" && !amount)}
                        >
                          {saving ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          {saving ? "جاري الحفظ..." : "تأكيد الاشتراك"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>
            ))}
          </div>

          {!loading && filtered.length === 0 && (
            <div className="text-center py-10 text-muted-foreground col-span-full">
              <p>لا يوجد مستخدمين متاحين حالياً.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}