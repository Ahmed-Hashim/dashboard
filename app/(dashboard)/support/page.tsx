"use client";

import React, { useEffect, useState, useCallback } from "react"; // ✅ Import useCallback
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
import { Loader2, Send, MessageSquareText } from "lucide-react";

type SupportMessage = Tables<"support_messages">;

// ✅ Helper component for cleaner status badges
const StatusBadge = ({ status }: { status: string }) => {
  const statusMap = {
    pending: {
      text: "قيد الانتظار",
      className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    },
    in_progress: {
      text: "قيد المراجعة",
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    },
    resolved: {
      text: "تم الرد",
      className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    },
  };

  const currentStatus = statusMap[status as keyof typeof statusMap] || statusMap.pending;

  return (
    <span className={`px-3 py-1 rounded-md text-xs font-medium ${currentStatus.className}`}>
      {currentStatus.text}
    </span>
  );
};


export default function SupportAdminPage() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true); // ✅ Start with loading true
  const [selected, setSelected] = useState<SupportMessage | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  // ✅ Wrap fetchMessages in useCallback to stabilize the function reference
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("support_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("status", filter);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Failed to fetch messages:", error);
      // Here you might want to show a toast notification to the user
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  }, [filter]); // Dependency is filter, as it changes the query

  // ✅ Now the useEffect dependency array is correct and safe
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const updateStatus = async (id: string, status: string) => {
    const { data, error } = await supabase
      .from("support_messages")
      .update({ status })
      .eq("id", id)
      .select() // ✅ Select the updated row to get the latest data
      .single();

    if (error) {
      console.error("Failed to update status:", error);
    } else if (data) {
      // ✅ Optimistic UI: Update the state locally instead of re-fetching all messages
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === id ? data : msg))
      );
    }
  };

  const handleReply = async () => {
    if (!selected || !reply.trim()) return;

    setSending(true);
    const { data, error } = await supabase
      .from("support_messages")
      .update({ admin_reply: reply, status: "resolved" })
      .eq("id", selected.id)
      .select()
      .single();

    if (error) {
      console.error("Failed to send reply:", error);
    } else if (data) {
      // ✅ Optimistic UI
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === selected.id ? data : msg))
      );
      setReply("");
      setSelected(null);
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
          {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "تحديث"}
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-right">البريد الإلكتروني</TableHead>
              <TableHead className="text-right">الموضوع</TableHead>
              <TableHead className="text-right">الرسالة</TableHead>
              <TableHead className="text-right">رد الأدمن</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right w-[280px]">الإجراء</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* ✅ Improved Loading and Empty States */}
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <Loader2 className="mx-auto animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <MessageSquareText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  لا توجد رسائل تطابق هذا الفلتر.
                </TableCell>
              </TableRow>
            ) : (
              messages.map((msg) => (
                <TableRow key={msg.id}>
                  <TableCell>{msg.name}</TableCell>
                  <TableCell>{msg.email}</TableCell>
                  <TableCell>{msg.subject}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{msg.message}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-green-700 dark:text-green-400">
                    {msg.admin_reply || "—"}
                  </TableCell>
                  <TableCell>
                    {/* ✅ Use the helper component for cleaner code */}
                    <StatusBadge status={msg.status ?? "pending"} />
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
                      value={msg.status ?? "pending"}
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>الرد على الرسالة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p><strong>من:</strong> {selected?.name} ({selected?.email})</p>
            <p><strong>الموضوع:</strong> {selected?.subject}</p>
            <div className="p-3 border rounded bg-muted max-h-40 overflow-y-auto">
              <p>{selected?.message}</p>
            </div>

            {selected?.admin_reply && (
              <div className="p-3 border rounded bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-100">
                <strong>ردك السابق:</strong> {selected.admin_reply}
              </div>
            )}

            <Textarea
              placeholder="اكتب ردك هنا..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSelected(null)}>إلغاء</Button>
            {/* ✅ Disable button if reply is empty */}
            <Button onClick={handleReply} disabled={sending || !reply.trim()}>
              {sending ? (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="ml-2 h-4 w-4" />
              )}
              إرسال الرد
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}