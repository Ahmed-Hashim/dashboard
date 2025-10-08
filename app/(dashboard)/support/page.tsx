"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Tables } from "@/types/database";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";

type SupportMessage = Tables<"support_messages">;

export default function SupportAdminPage() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<SupportMessage | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    let query = supabase
      .from("support_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter !== "all") query = query.eq("status", filter);

    const { data, error } = await query;
    if (error) console.error(error);
    else setMessages(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("support_messages")
      .update({ status })
      .eq("id", id);

    if (error) console.error(error);
    else fetchMessages();
  };

  const handleReply = async () => {
    if (!selected || !reply.trim()) return;

    setSending(true);
    const { error } = await supabase
      .from("support_messages")
      .update({ admin_reply: reply, status: "resolved" })
      .eq("id", selected.id);

    if (error) console.error(error);
    else {
      setReply("");
      setSelected(null);
      fetchMessages();
    }
    setSending(false);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">📩 صفحة الدعم الفني</h1>

      <div className="flex items-center justify-between mb-4">
        <Select onValueChange={setFilter} defaultValue="all" dir="rtl">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="تصفية حسب الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الرسائل</SelectItem>
            <SelectItem value="pending">قيد الانتظار</SelectItem>
            <SelectItem value="in_progress">قيد المراجعة</SelectItem>
            <SelectItem value="resolved">تم الرد</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={fetchMessages} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : "تحديث"}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">الاسم</TableHead>
            <TableHead className="text-right">البريد الإلكتروني</TableHead>
            <TableHead className="text-right">الموضوع</TableHead>
            <TableHead className="text-right">الرسالة</TableHead>
            <TableHead className="text-right">رد الأدمن</TableHead>
            <TableHead className="text-right">الحالة</TableHead>
            <TableHead className="text-right">الإجراء</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((msg) => (
            <TableRow key={msg.id}>
              <TableCell>{msg.name}</TableCell>
              <TableCell>{msg.email}</TableCell>
              <TableCell>{msg.subject}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {msg.message}
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-green-700 dark:text-green-400">
                {msg.admin_reply ? msg.admin_reply : "—"}
              </TableCell>
              <TableCell>
                <span
                  className={`px-3 py-1 rounded-md text-xs font-medium
                    ${
                      msg.status === "pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                        : msg.status === "in_progress"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    }`}
                >
                  {msg.status === "pending"
                    ? "قيد الانتظار"
                    : msg.status === "in_progress"
                    ? "قيد المراجعة"
                    : "تم الرد"}
                </span>
              </TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelected(msg);
                    setReply(msg.admin_reply || "");
                  }}
                >
                  عرض والرد
                </Button>

                <Select
                  dir="rtl"
                  defaultValue={msg.status ?? "pending"}
                  onValueChange={(value) => updateStatus(msg.id, value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="تغيير الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">قيد الانتظار</SelectItem>
                    <SelectItem value="in_progress">قيد المراجعة</SelectItem>
                    <SelectItem value="resolved">تم الرد</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ✅ Dialog للرد */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>الرد على الرسالة</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p>
              <strong>من:</strong> {selected?.name} ({selected?.email})
            </p>
            <p>
              <strong>الموضوع:</strong> {selected?.subject}
            </p>
            <p className="p-3 border rounded bg-muted">{selected?.message}</p>

            {selected?.admin_reply && (
              <div className="p-3 border rounded bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-100">
                <strong>رد الأدمن:</strong> {selected.admin_reply}
              </div>
            )}

            <Textarea
              placeholder="اكتب ردك هنا..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleReply} disabled={sending}>
              {sending ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              إرسال الرد
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
