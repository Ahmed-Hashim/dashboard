"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabaseClient";

import { paymentsColumns } from "./columns";
import GenericTable from "@/components/GenericTable";
import { AddPaymentDialog } from "@/components/Payments/AddPaymentDialog"

type PurchaseWithDetails = {
  id: string;
  user_id: string;
  course_id: number;
  amount: number;
  currency: string | null;
  status: string;
  purchased_at: string;
  invoice_url: string | null;
  payment_id: string | null;
  course_title: string | null;
  user_email: string | null;
};

export default function PaymentsPage() {
  const [purchases, setPurchases] = useState<PurchaseWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchPurchases = useCallback(async () => {
    try {
      setLoading(true);

      let baseQuery = supabase
        .from("purchases_with_users")
        .select("*")
        .order("purchased_at", { ascending: false });

      if (statusFilter && statusFilter !== "all") {
        baseQuery = baseQuery.eq("status", statusFilter);
      }

      let { data } = await baseQuery;

      if (search.trim() && data) {
        const term = search.trim().toLowerCase();
        data = data.filter(
          (item) =>
            item.user_email?.toLowerCase().includes(term) ||
            item.id?.toLowerCase().includes(term)
        );
      }

      setPurchases(data || []);
    } catch (err) {
      console.error("Error fetching purchases:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  return (
    <div className="p-6 space-y-6">
      {/* 🔍 Search, Filters, and Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* حقول البحث والفلترة */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-grow">
          <Input
            placeholder="ابحث برقم الدفع أو بريد المستخدم"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Select
            onValueChange={(value) =>
              setStatusFilter(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="فلترة حسب الحالة" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
              <SelectItem
                value="all"
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                الكل
              </SelectItem>
              <SelectItem
                value="succeeded"
                className="cursor-pointer hover:bg-green-100 dark:hover:bg-green-900 transition-colors"
              >
                ناجحة
              </SelectItem>
              <SelectItem
                value="pending"
                className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900 transition-colors"
              >
                قيد الانتظار
              </SelectItem>
              <SelectItem
                value="failed"
                className="cursor-pointer hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
              >
                فشلت
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* زر إضافة دفعة جديدة */}
        <AddPaymentDialog onPaymentAdded={fetchPurchases} />
      </div>

      {/* 🧾 Table */}
      <GenericTable
        columns={paymentsColumns}
        data={purchases}
        loading={loading}
        emptyMessage="لا توجد مدفوعات تطابق معايير البحث."
      />
    </div>
  );
}