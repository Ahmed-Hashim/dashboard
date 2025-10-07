"use client";

import { Button } from "@/components/ui/button";

export const QuickActions = () => (
  <div className="flex flex-wrap gap-4 mb-6">
    <Button onClick={() => alert("إضافة كورس")}>إضافة كورس</Button>
    <Button onClick={() => alert("رفع فيديو")}>رفع فيديو</Button>
    <Button onClick={() => alert("إرسال بريد جماعي")}>إرسال بريد جماعي</Button>
  </div>
);
