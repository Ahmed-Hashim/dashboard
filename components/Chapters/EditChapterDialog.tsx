"use client";

import { useState, useEffect, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { ChapterWithVideos } from "@/app/(dashboard)/chapters/page";

type EditChapterDialogProps = {
  chapter: ChapterWithVideos | null;
  onClose: () => void;
  onChapterUpdated: (updatedChapter: ChapterWithVideos) => void;
};

export function EditChapterDialog({
  chapter,
  onClose,
  onChapterUpdated,
}: EditChapterDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Expanded state to include all editable fields
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order_index: 0,
    duration: "",
    image_url: "",
  });

  useEffect(() => {
    // Update form data only when the dialog opens with a new chapter
    if (chapter) {
      setFormData({
        title: chapter.title,
        description: chapter.description || "",
        order_index: chapter.order_index || 0,
        duration: chapter.duration || "", // Populate duration
        image_url: chapter.image_url || "", // Populate image_url
      });
    }
  }, [chapter]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!chapter) return;

    setIsSubmitting(true);

    const { data, error } = await supabase
      .from("course_chapters")
      .update({
        title: formData.title,
        description: formData.description,
        order_index: formData.order_index,
        duration: formData.duration || null, // Send new fields, use null if empty
        image_url: formData.image_url || null, // Send new fields, use null if empty
      })
      .eq("id", chapter.id)
      .select("*, course_videos(*)") // Fetch updated data with videos
      .single();

    if (error) {
      console.error("Error updating chapter:", error);
      alert("فشل تحديث الفصل.");
    } else if (data) {
      onChapterUpdated(data as ChapterWithVideos);
      onClose();
    }
    setIsSubmitting(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "order_index" ? Number(value) : value,
    }));
  };

  if (!chapter) return null;

  return (
    <Dialog open={!!chapter} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تعديل الفصل: {chapter.title}</DialogTitle>
          <DialogDescription>
            قم بتحديث بيانات الفصل ثم اضغط على حفظ.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                العنوان
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                الوصف
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="order_index" className="text-right">
                الترتيب
              </Label>
              <Input
                id="order_index"
                name="order_index"
                type="number"
                value={formData.order_index}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            {/* New Field: Duration */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                المدة
              </Label>
              <Input
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="e.g., 2h 30m"
              />
            </div>
            {/* New Field: Image URL */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image_url" className="text-right">
                رابط الصورة
              </Label>
              <Input
                id="image_url"
                name="image_url"
                type="url"
                value={formData.image_url}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="https://example.com/image.png"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              )}
              حفظ التعديلات
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}