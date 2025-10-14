"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Tables } from "@/types/database";

// نوع الفيديو من الجدول
type Video = Tables<"course_videos">;

type EditVideoDialogProps = {
  video: Video;
  onUpdate?: (updated: Partial<Video>) => void;
};

export const EditVideoDialog = ({ video, onUpdate }: EditVideoDialogProps) => {
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description ?? "");
  const [youtubeId, setYoutubeId] = useState(video.youtube_id);
  const [chapterId, setChapterId] = useState(video.chapter_id ?? 0);
  const [thumbnailUrl, setThumbnailUrl] = useState(video.thumbnail_url ?? "");
  const [attachmentUrl, setAttachmentUrl] = useState(video.attachment_url ?? "");
  const [duration, setDuration] = useState(video.duration ?? 0);
  const [orderIndex, setOrderIndex] = useState(video.order_index ?? 0);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const updatedData = {
      title,
      description,
      youtube_id: youtubeId || null,
      chapter_id: chapterId || null,
      thumbnail_url: thumbnailUrl,
      attachment_url: attachmentUrl,
      duration: duration || null,
      order_index: orderIndex || null,
    };
    await supabase.from("course_videos").update(updatedData).eq("id", video.id);
    setLoading(false);
    if (onUpdate) onUpdate({ ...updatedData, youtube_id: youtubeId || undefined });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 ml-1" /> تعديل
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle>تعديل الفيديو</DialogTitle>
        </DialogHeader>

        <div dir="rtl" className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* العنوان */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-right">العنوان</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          {/* الوصف */}
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-sm font-medium text-right">الوصف</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          {/* YouTube ID */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-right">YouTube ID</label>
            <Input value={youtubeId} onChange={(e) => setYoutubeId(e.target.value)} />
          </div>

          {/* Chapter ID */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-right">رقم الفصل</label>
            <Input type="number" value={chapterId} onChange={(e) => setChapterId(Number(e.target.value))} />
          </div>

          {/* Duration */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-right">مدة الفيديو (ثواني)</label>
            <Input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
          </div>

          {/* Order Index */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-right">ترتيب الفيديو</label>
            <Input type="number" value={orderIndex} onChange={(e) => setOrderIndex(Number(e.target.value))} />
          </div>

          {/* Thumbnail URL */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-right">رابط الصورة المصغرة</label>
            <Input value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} />
          </div>

          {/* Attachment URL */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-right">رابط المرفق</label>
            <Input value={attachmentUrl} onChange={(e) => setAttachmentUrl(e.target.value)} />
          </div>

          {/* زر الحفظ */}
          <div className="md:col-span-2 mt-2 flex justify-end">
            <Button onClick={handleSave} disabled={loading}>
              حفظ التغييرات
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
