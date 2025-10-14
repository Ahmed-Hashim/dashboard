// components/content/chapters/DeleteConfirmationDialog.tsx
"use client";

import { supabase } from "@/lib/supabaseClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Chapter, Video } from "@/app/(dashboard)/chapters/page";

type DeleteConfirmationDialogProps = {
  chapterToDelete: Chapter | null;
  videoToDelete: Video | null;
  onClose: () => void;
  onChapterDeleted: (chapterId: number) => void;
  onVideoDeleted: (videoId: string, chapterId: number | null) => void;
};

export function DeleteConfirmationDialog({
  chapterToDelete,
  videoToDelete,
  onClose,
  onChapterDeleted,
  onVideoDeleted,
}: DeleteConfirmationDialogProps) {
  const isOpen = !!chapterToDelete || !!videoToDelete;
  const item = chapterToDelete || videoToDelete;
  const isChapter = !!chapterToDelete;

  const handleConfirmDelete = async () => {
    if (isChapter && chapterToDelete) {
      const { error } = await supabase
        .from("course_chapters")
        .delete()
        .eq("id", chapterToDelete.id);
      if (error) {
        alert("فشل حذف الفصل.");
      } else {
        onChapterDeleted(chapterToDelete.id);
      }
    } else if (videoToDelete) {
      const { error } = await supabase
        .from("course_videos")
        .delete()
        .eq("id", videoToDelete.id);
      if (error) {
        alert("فشل حذف الفيديو.");
      } else {
        onVideoDeleted(videoToDelete.id, videoToDelete.chapter_id);
      }
    }
    onClose();
  };

  if (!item) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
          <AlertDialogDescription>
            {isChapter
              ? `سيتم حذف الفصل "${item.title}" وكل الفيديوهات التي بداخله بشكل نهائي.`
              : `سيتم حذف الفيديو "${item.title}" بشكل نهائي.`}
            <br />
            لا يمكن التراجع عن هذا الإجراء.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>إلغاء</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmDelete}>نعم، حذف</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}