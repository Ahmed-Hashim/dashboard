"use client";

import React, { useEffect, useState } from "react";
import { Tables } from "@/types/database";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";

type PurchaseWithCourse = Tables<"purchases"> & { course: Tables<"courses"> };

export default function PaymentsPage() {
  const [purchases, setPurchases] = useState<PurchaseWithCourse[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPurchases();
  }, [statusFilter, search]);

  const fetchPurchases = async () => {
    let query = supabase
      .from("purchases")
      .select(`*, course:course_id(*)`)
      .order("purchased_at", { ascending: false });

    if (statusFilter) query = query.eq("status", statusFilter);
    if (search) query = query.ilike("id", `%${search}%`);

    const { data, error } = await query;

    if (error) console.error(error);
    else setPurchases(data as PurchaseWithCourse[]);
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "paid":
        return <Badge variant="success">مدفوع</Badge>;
      case "pending":
        return <Badge variant="warning">قيد الانتظار</Badge>;
      case "cancelled":
        return <Badge variant="destructive">ملغى</Badge>;
      default:
        return <Badge variant="secondary">غير محدد</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Input
          placeholder="ابحث برقم الدفع"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select onValueChange={(value) => setStatusFilter(value || null)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="فلترة حسب الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">الكل</SelectItem>
            <SelectItem value="paid">مدفوع</SelectItem>
            <SelectItem value="pending">قيد الانتظار</SelectItem>
            <SelectItem value="cancelled">ملغى</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>رقم الدفع</TableHead>
            <TableHead>الدورة</TableHead>
            <TableHead>المبلغ</TableHead>
            <TableHead>العملة</TableHead>
            <TableHead>تاريخ الشراء</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>الفاتورة</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((purchase) => (
            <TableRow key={purchase.id}>
              <TableCell>{purchase.id}</TableCell>
              <TableCell>{purchase.course?.title || "-"}</TableCell>
              <TableCell>{purchase.amount}</TableCell>
              <TableCell>{purchase.currency || "EGP"}</TableCell>
              <TableCell>{purchase.purchased_at ? new Date(purchase.purchased_at).toLocaleDateString() : "-"}</TableCell>
              <TableCell>{getStatusBadge(purchase.status)}</TableCell>
              <TableCell>
                {purchase.invoice_url ? (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                  >
                    <a href={purchase.invoice_url} target="_blank">عرض الفاتورة</a>
                  </Button>
                ) : (
                  "-"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {purchases.length === 0 && (
        <div className="text-center text-gray-500 py-10">لا توجد مدفوعات</div>
      )}
    </div>
  );
}
