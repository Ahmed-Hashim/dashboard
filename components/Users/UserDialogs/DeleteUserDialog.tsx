"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type DeleteUserDialogProps = {
  userId: string;
  onDeleted?: () => void;
};

export default function DeleteUserDialog({ userId, onDeleted }: DeleteUserDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await supabase.from("profiles").delete().eq("user_id", userId);
      await supabase.from("user_roles").delete().eq("user_id", userId);
      onDeleted?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" title="حذف المستخدم">
          <Trash className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>تأكيد الحذف</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          هل أنت متأكد أنك تريد حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" disabled={loading}>
            إلغاء
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "جارٍ الحذف..." : "حذف"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
