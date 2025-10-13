"use client";

import { useState, FormEvent } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusCircle } from "lucide-react";
import { ChapterWithVideos } from "@/app/(dashboard)/chapters/page";

type AddChapterDialogProps = {
  courseId: number;
  onChapterAdded: (newChapter: ChapterWithVideos) => void;
  nextOrderIndex: number;
};

export function AddChapterDialog({
  courseId,
  onChapterAdded,
  nextOrderIndex,
}: AddChapterDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const order_index = Number(formData.get("order_index"));
    // Get new fields from the form
    const duration = formData.get("duration") as string;
    const image_url = formData.get("image_url") as string;

    if (!title) {
      alert("عنوان الفصل مطلوب.");
      setIsSubmitting(false);
      return;
    }

    const { data, error } = await supabase
      .from("course_chapters")
      .insert({
        title,
        description,
        order_index,
        course_id: courseId,
        duration: duration || null, // Send null if the string is empty
        image_url: image_url || null, // Send null if the string is empty
      })
      .select("*, course_videos!left(*)") // Fetch with an empty videos array
      .single();

    if (error) {
      console.error("Error adding chapter:", error);
      alert("فشل إضافة الفصل. يرجى المحاولة مرة أخرى.");
    } else if (data) {
      onChapterAdded(data as ChapterWithVideos);
      // Reset form by closing and re-opening, or implement manual reset
      setIsOpen(false); 
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="ml-2 h-4 w-4" />
          إضافة فصل جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة فصل جديد</DialogTitle>
          <DialogDescription>
            املأ الحقول التالية لإضافة فصل جديد للكورس.
          </DialogDescription>
        </DialogHeader>
        {/* We add a key to the form to force a re-render and clear fields when dialog closes/opens */}
        <form key={isOpen ? 'open' : 'closed'} onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">العنوان</Label>
              <Input id="title" name="title" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">الوصف</Label>
              <Textarea id="description" name="description" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="order_index" className="text-right">الترتيب</Label>
              <Input id="order_index" name="order_index" type="number" defaultValue={nextOrderIndex} className="col-span-3" required />
            </div>
            {/* New Field: Duration */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                المدة
              </Label>
              <Input
                id="duration"
                name="duration"
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
                className="col-span-3"
                placeholder="https://example.com/image.png"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>إلغاء</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              حفظ الفصل
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}