"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { toast } from "sonner";

type DeleteVideoDialogProps = {
  videoId: string;
  onDelete?: () => void;
};

export const DeleteVideoDialog = ({
  videoId,
  onDelete,
}: DeleteVideoDialogProps) => {
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/bunny/delete/${videoId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      toast.success("تم حذف الفيديو بنجاح");
      if (!res.ok) throw new Error(data.error || "حدث خطأ");

      if (onDelete) onDelete();
    } catch (err: unknown) {
      toast.error(
        "فشل الحذف: " + (err instanceof Error ? err.message : String(err))
      );
    }
  };

  return (
    <Dialog >
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash className="w-4 h-4 ml-1" /> حذف
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm w-full" dir="rtl">
        <DialogHeader dir="rtl">
          <DialogTitle>تأكيد الحذف</DialogTitle>
        </DialogHeader>
        <p className="my-4 text-sm">هل تريد بالتأكيد حذف هذا الفيديو؟</p>
        <Button
          variant="destructive"
          className="hover:bg-red-600 !important"
          onClick={handleDelete}
        >
          حذف
        </Button>
      </DialogContent>
    </Dialog>
  );
};
