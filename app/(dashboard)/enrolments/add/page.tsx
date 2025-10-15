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
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

type User = {
  id: string;
  full_name: string;
  email: string;
};

export default function EnrollmentUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState("free");
  const [saving, setSaving] = useState(false);
  const courseId = 2;
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (search.trim() === "") setFiltered(users);
    else
      setFiltered(
        users.filter((u) =>
          u.full_name.toLowerCase().includes(search.toLowerCase())
        )
      );
  }, [search, users]);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc(
      "get_available_users_for_enrollment",
      { course_id: 2 }
    );

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setUsers(data || []);
    setFiltered(data || []);
    setLoading(false);
  };

  const handleEnroll = async () => {
    if (!selectedUser) return;
    setSaving(true);

    const isPaid = paymentType === "paid";

    let purchaseId: string | null = null;

    // لو مدفوع نضيف في purchases أولًا
    if (isPaid) {
      const { data: purchase, error: purchaseErr } = await supabase
        .from("purchases")
        .insert([
          {
            user_id: selectedUser.id,
            course_id: courseId,
            amount: parseFloat(amount),
            status: "succeeded", // ✅ بدل completed
          },
        ])
        .select()
        .single();

      if (purchaseErr) {
        console.error(purchaseErr);
        setSaving(false);
        return;
      }

      purchaseId = purchase.id;
    }

    // ثم نضيف الاشتراك
    const { error: enrollErr } = await supabase.from("enrollments").insert([
      {
        user_id: selectedUser.id,
        course_id: courseId,
        purchase_id: purchaseId,
      },
    ]);

    if (enrollErr) {
      console.error(enrollErr);
    } else {
      fetchUsers(); // نحدّث القائمة بعد الإضافة
      setSelectedUser(null);
    }

    setSaving(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">المستخدمين المتاحين للاشتراك</h1>
        <Input
          placeholder="🔍 ابحث عن المستخدم..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((user) => (
            <Card key={user.id} className="border">
              <CardContent className="p-4 space-y-2">
                <h2 className="font-medium">{user.full_name}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="default"
                      className="w-full mt-2"
                      onClick={() => {
                        setSelectedUser(user);
                        setAmount("");
                        setPaymentType("free");
                      }}
                    >
                      إضافة اشتراك
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>إضافة اشتراك للمستخدم</DialogTitle>
                    </DialogHeader>

                    {selectedUser && (
                      <div className="space-y-4 py-3">
                        <p>
                          <span className="font-semibold">الاسم:</span>{" "}
                          {selectedUser.full_name}
                        </p>
                        <p>
                          <span className="font-semibold">
                            البريد الإلكتروني:
                          </span>{" "}
                          {selectedUser.email}
                        </p>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            نوع الدفع
                          </label>
                          <select
                            className="border rounded-md p-2 w-full"
                            value={paymentType}
                            onChange={(e) => setPaymentType(e.target.value)}
                          >
                            <option value="free">مجاني</option>
                            <option value="paid">مدفوع</option>
                          </select>
                        </div>

                        {paymentType === "paid" && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              المبلغ المدفوع (جنيه)
                            </label>
                            <Input
                              type="number"
                              placeholder="أدخل المبلغ..."
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    <DialogFooter>
                      <Button variant="outline">إلغاء</Button>
                      <Button
                        onClick={handleEnroll}
                        disabled={saving || (paymentType === "paid" && !amount)}
                      >
                        {saving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "تأكيد الاشتراك"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
