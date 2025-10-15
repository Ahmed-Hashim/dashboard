"use client";

import React from "react";
import { Column } from "@/components/GenericTable";
import { Button } from "@/components/ui/button";

export type EnrolmentWithDetails = {
  enrollment_id: string;
  user_id: string;
  course_id: number;
  enrolled_at: string;
  user_name: string | null;
  user_email: string | null;
  course_title: string | null;
  purchase_id: string | null;
};

// ✅ Fully typed, clean, and localized columns
export const enrolmentsColumns: Column<EnrolmentWithDetails>[] = [
  {
    key: "enrollment_id",
    label: "رقم التسجيل",
    className: "font-mono text-xs",
  },
  {
    key: "user_name",
    label: "اسم المستخدم",
    render: (item) => item.user_name ?? "غير متوفر",
  },
  {
    key: "user_email",
    label: "البريد الإلكتروني",
    render: (item) => item.user_email ?? "غير متوفر",
  },
  {
    key: "course_title",
    label: "اسم الدورة",
    render: (item) => item.course_title ?? "غير محدد",
  },
  {
    key: "enrolled_at",
    label: "تاريخ التسجيل",
    render: (item) =>
      item.enrolled_at
        ? new Date(item.enrolled_at).toLocaleDateString("ar-EG", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        : "-",
  },
  {
    key: "purchase_id",
    label: "الدفع المرتبط",
    render: (item) =>
      item.purchase_id ? (
        <Button asChild variant="outline" size="sm">
          <a
            href={`/purchases/${item.purchase_id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            عرض الدفع
          </a>
        </Button>
      ) : (
        "-"
      ),
  },
];
