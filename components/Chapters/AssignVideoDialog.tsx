// components/admin/chapters/AssignVideoDialog.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Video } from "@/app/(dashboard)/chapters/page";

type AssignVideoDialogProps = {
  chapterId: number;
  courseId: number;
  onVideosAssigned: (assignedVideos: Video[]) => void;
  trigger: React.ReactNode;
};

export function AssignVideoDialog({ chapterId, courseId, onVideosAssigned, trigger }: AssignVideoDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [unassignedVideos, setUnassignedVideos] = useState<Video[]>([]);
  const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]);

  useEffect(() => {
    // جلب الفيديوهات غير المرتبطة فقط عند فتح النافذة
    if (isOpen) {
      const fetchUnassignedVideos = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from("course_videos")
          .select("*")
          .eq("course_id", courseId)
          .is("chapter_id", null); // الشرط الأساسي: جلب الفيديوهات التي ليس لها فصل

        if (error) {
          alert("فشل جلب الفيديوهات المتاحة.");
        } else {
          setUnassignedVideos(data || []);
        }
        setLoading(false);
      };
      fetchUnassignedVideos();
    } else {
      // إعادة تعيين الحالة عند إغلاق النافذة
      setSelectedVideoIds([]);
    }
  }, [isOpen, courseId]);

  const handleSelectionChange = (videoId: string) => {
    setSelectedVideoIds(prev =>
      prev.includes(videoId)
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  const handleSubmit = async () => {
    if (selectedVideoIds.length === 0) {
      alert("الرجاء اختيار فيديو واحد على الأقل.");
      return;
    }
    setIsSubmitting(true);

    const { data, error } = await supabase
      .from("course_videos")
      .update({ chapter_id: chapterId })
      .in("id", selectedVideoIds) // تحديث كل الفيديوهات المختارة
      .select();

    if (error) {
      alert("فشل ربط الفيديوهات.");
    } else if (data) {
      onVideosAssigned(data as Video[]);
      setIsOpen(false);
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>ربط فيديوهات بالفصل</DialogTitle>
          <DialogDescription>
            اختر الفيديوهات التي تريد إضافتها من القائمة أدناه. ستظهر فقط الفيديوهات غير المرتبطة بأي فصل آخر.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-72 w-full rounded-md border p-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : unassignedVideos.length > 0 ? (
            <div className="space-y-4">
              {unassignedVideos.map(video => (
                <div key={video.id} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id={`video-${video.id}`}
                    onCheckedChange={() => handleSelectionChange(video.id)}
                    checked={selectedVideoIds.includes(video.id)}
                  />
                  <Label htmlFor={`video-${video.id}`} className="flex-1 cursor-pointer">
                    {video.title}
                  </Label>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground pt-10">لا توجد فيديوهات متاحة للربط.</p>
          )}
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>إلغاء</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || selectedVideoIds.length === 0}>
            {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            إضافة الفيديوهات المختارة
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}