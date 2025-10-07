"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type DeleteVideoDialogProps = {
  videoId: string;
  onDelete?: () => void;
};

export const DeleteVideoDialog = ({ videoId, onDelete }: DeleteVideoDialogProps) => {
  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد من حذف هذا الفيديو؟")) return;
    await supabase.from("course_videos").delete().eq("id", videoId);
    if (onDelete) onDelete();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash className="w-4 h-4 ml-1" /> حذف
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm w-full">
        <DialogHeader>
          <DialogTitle>تأكيد الحذف</DialogTitle>
        </DialogHeader>
        <p className="my-4 text-sm">هل تريد بالتأكيد حذف هذا الفيديو؟</p>
        <Button variant="destructive" onClick={handleDelete}>
          حذف
        </Button>
      </DialogContent>
    </Dialog>
  );
};
