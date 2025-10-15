"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Column } from "@/components/GenericTable";

export type PurchaseWithDetails = {
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

export const getStatusBadge = (status: string | null) => {
  switch (status) {
    case "succeeded":
      return <Badge variant="success">ناجحة</Badge>;
    case "pending":
      return <Badge variant="warning">قيد الانتظار</Badge>;
    case "failed":
      return <Badge variant="destructive">فشلت</Badge>;
    default:
      return <Badge variant="secondary">غير محدد</Badge>;
  }
};

// ✅ Type-safe columns array
export const paymentsColumns: Column<PurchaseWithDetails>[] = [
  { key: "id", label: "رقم الدفع", className: "font-mono text-xs" },
  { key: "user_email", label: "المستخدم" },
  { key: "course_title", label: "الدورة" },
  {
    key: "amount",
    label: "المبلغ",
    render: (item) => {
      const currencyNames: Record<string, string> = {
        EGP: "جنيه مصري",
        USD: "دولار أمريكي",
        EUR: "يورو",
        SAR: "ريال سعودي",
        AED: "درهم إماراتي",
        KWD: "دينار كويتي",
        QAR: "ريال قطري",
      };

      const currency =
        currencyNames[item.currency || "EGP"] || item.currency || "جنيه مصري";

      const formattedAmount = new Intl.NumberFormat("ar-EG", {
        minimumFractionDigits: 0,
      }).format(item.amount || 0);

      return `${formattedAmount} ${currency}`;
    },
  },
  {
    key: "purchased_at",
    label: "تاريخ الشراء",
    render: (item) =>
      item.purchased_at
        ? new Date(item.purchased_at).toLocaleDateString("ar-EG")
        : "-",
  },
  {
    key: "status",
    label: "الحالة",
    render: (item) => getStatusBadge(item.status),
  },
  {
    key: "invoice_url",
    label: "الفاتورة",
    render: (item) =>
      item.invoice_url ? (
        <Button asChild variant="outline" size="sm">
          <a href={item.invoice_url} target="_blank" rel="noopener noreferrer">
            عرض الفاتورة
          </a>
        </Button>
      ) : (
        "-"
      ),
  },
];
