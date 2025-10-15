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
  enrolled: boolean;
};

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
    const { data, error } = await supabase
      .from("users")
      .select("id, full_name, email");

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    // simulate: filter users who are not already enrolled
    const { data: enrollments } = await supabase.from("enrollments").select("user_id");
    const enrolledIds = enrollments?.map((e) => e.user_id) ?? [];

    const cleanUsers = data.map((u) => ({
      ...u,
      enrolled: enrolledIds.includes(u.id),
    }));

    setUsers(cleanUsers);
    setFiltered(cleanUsers);
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">قائمة المستخدمين</h1>
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
            <Card
              key={user.id}
              className={`border ${user.enrolled ? "opacity-60" : ""}`}
            >
              <CardContent className="p-4 space-y-2">
                <h2 className="font-medium">{user.full_name}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant={user.enrolled ? "outline" : "default"}
                      disabled={user.enrolled}
                      className="w-full mt-2"
                      onClick={() => setSelectedUser(user)}
                    >
                      {user.enrolled ? "مشترك بالفعل" : "إضافة اشتراك"}
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>تأكيد الاشتراك</DialogTitle>
                    </DialogHeader>
                    {selectedUser && (
                      <div className="space-y-4 py-4">
                        <p>
                          الاسم:{" "}
                          <span className="font-semibold">
                            {selectedUser.full_name}
                          </span>
                        </p>
                        <p>البريد الإلكتروني: {selectedUser.email}</p>
                        <p className="text-gray-600 text-sm">
                          هل ترغب في تسجيل هذا المستخدم في الكورس الحالي؟
                        </p>
                      </div>
                    )}
                    <DialogFooter>
                      <Button variant="outline">إلغاء</Button>
                      <Button
                        onClick={() => {
                          // handleEnroll(selectedUser)
                        }}
                      >
                        تأكيد الاشتراك
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
