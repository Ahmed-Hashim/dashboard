"use client";

import { Tables } from "@/types/database";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImagePlus } from "lucide-react";
import { MediaManagerDialog } from "../MediaManagerDialog";
import Image from "next/image";

type Course = Tables<"courses"> & {
  views: number;
  instructor_name?: string;
};

interface Props {
  course: Course;
  onSave: (updatedCourse: Course) => void;
}

export const CourseEditForm = ({ course, onSave }: Props) => {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description || "");
  const [instructor, setInstructor] = useState(course.instructor || "");
  const [price, setPrice] = useState(course.price?.toString() || "0");
  const [ytVideoId, setYtVideoId] = useState(course.yt_video_id || "");
  const [imageUrl, setImageUrl] = useState(course.image_url || "");
  const [published, setPublished] = useState(course.published || false);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If 'price' is an empty string or cannot be parsed, it defaults to 0.
    const priceValue = parseFloat(price) || 0;

    onSave({
      ...course,
      title,
      description,
      instructor: instructor,
      price: priceValue, // Use the validated price value
      yt_video_id: ytVideoId || null,
      image_url: imageUrl || null,
      published,
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-6 rounded-lg shadow bg-white dark:bg-gray-800"
      >
        <div>
          <label className="block font-semibold mb-1">عنوان الكورس</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">وصف الكورس</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">المدرب</label>
          <Input
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">السعر</label>
          <Input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">
            رابط فيديو يوتيوب (Video ID)
          </label>
          <Input
            value={ytVideoId}
            onChange={(e) => setYtVideoId(e.target.value)}
            placeholder="مثال: dQw4w9WgXcQ"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">صورة الكورس</label>
          <div className="flex gap-2">
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="رابط مباشر للصورة"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => setMediaDialogOpen(true)}
            >
              <ImagePlus className="w-4 h-4 mr-2" />
              مكتبة الوسائط
            </Button>
          </div>
          {imageUrl && (
            <div className="mt-4">
              <Image
                src={imageUrl}
                alt="Course preview"
                className="max-h-48 rounded-lg border"
                width={192}
                height={192}
              />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="flex items-center space-x-3">
            <Switch checked={published} onCheckedChange={setPublished} />
            <span className="text-gray-700 dark:text-gray-300">
              {published ? "منشور" : "غير منشور"}
            </span>
          </div>
        </div>

        <Button type="submit">حفظ التعديلات</Button>
      </form>

      <MediaManagerDialog
        open={mediaDialogOpen}
        onOpenChange={setMediaDialogOpen}
        onSelectImage={setImageUrl}
        currentImageUrl={imageUrl}
      />
    </>
  );
};
