"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";

import { enrolmentsColumns } from "./columns";
import GenericTable from "@/components/GenericTable";
import Link from "next/link";
// import { AddEnrollmentDialog } from "@/components/Enrolments/AddEnrollmentDialog";

// Define enrollment type
export type EnrolmentWithDetails = {
  enrollment_id: string;
  enrolled_at: string;
  user_id: string;
  user_name: string | null;
  user_email: string | null;
  course_id: number;
  course_title: string | null;
  purchase_id: string | null;
};

// RPC return type
type EnrollmentRPCResult = EnrolmentWithDetails;

// Main component
export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<EnrolmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc(
  "get_enrollments_with_details"
);

      if (error) {
        console.error("Error fetching enrollments:", error);
        setEnrollments([]);
        return;
      }

      const mappedData: EnrolmentWithDetails[] = (data || []).map(
        (e: EnrollmentRPCResult) => ({
          enrollment_id: e.enrollment_id,
          enrolled_at: e.enrolled_at,
          user_id: e.user_id,
          user_name: e.user_name,
          user_email: e.user_email,
          course_id: e.course_id,
          course_title: e.course_title,
          purchase_id: e.purchase_id,
        })
      );

      if (search.trim()) {
        const term = search.trim().toLowerCase();
        const filtered = mappedData.filter(
          (e) =>
            e.user_email?.toLowerCase().includes(term) ||
            e.enrollment_id?.toLowerCase().includes(term)
        );
        setEnrollments(filtered);
      } else {
        setEnrollments(mappedData);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  return (
    <div className="p-6 space-y-6">
      {/* Search & Add */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-grow">
          <Input
            placeholder="ابحث بالبريد أو رقم التسجيل"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Link href={"/enrolments/add"}>Add</Link>
        {/* <AddEnrollmentDialog onEnrollmentAdded={fetchEnrollments} /> */}
      </div>

      {/* Table */}
      <GenericTable<EnrolmentWithDetails>
        columns={enrolmentsColumns}
        data={enrollments}
        loading={loading}
        emptyMessage="لا توجد تسجيلات تطابق معايير البحث."
      />
    </div>
  );
}
