"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UploadCloud, Video } from "lucide-react";
import { Video as VideoType } from "@/app/(dashboard)/chapters/page";

type UploadFormValues = {
  title: string;
  file: FileList;
};

type Props = {
  courseId: number;
  onUploadSuccess?: (video: VideoType) => void;
};
// A helper function to get video duration from a File object
const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    // Create a new video element
    const video = document.createElement('video');
    video.preload = 'metadata'; // We only need the metadata, not the whole video

    // When the metadata is loaded, get the duration
    video.onloadedmetadata = function () {
      // Clean up the object URL to avoid memory leaks
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };

    // Handle errors
    video.onerror = function () {
      reject("Error reading video file.");
    };

    // Create a URL for the local file and set it as the video source
    video.src = window.URL.createObjectURL(file);
  });
};
export default function VideoUploader({ courseId, onUploadSuccess }: Props) {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, reset } = useForm<UploadFormValues>();

  const onSubmit = async (values: UploadFormValues) => {
  try {
    const file = values.file?.[0];
    const title = values.title?.trim();
    if (!file || !title) {
      toast.error("Please enter a title and select a file.");
      return;
    }

    setUploading(true);
    setProgress(0);

    // ✨ الخطوة الجديدة: الحصول على مدة الفيديو قبل الرفع
    const durationInSeconds = await getVideoDuration(file);
    console.log(`Video duration: ${durationInSeconds} seconds`); // يمكنك استخدام هذه القيمة

    // 1️⃣ Create Bunny video entry
    const { data: createData } = await axios.post("/api/bunny/create", { title });
    const { uploadUrl, guid, libraryId } = createData;

    // 2️⃣ Upload file to Bunny video endpoint
    await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": "application/octet-stream",
        "AccessKey": process.env.NEXT_PUBLIC_BUNNY_API_KEY || "",
      },
      onUploadProgress: (event) => {
        if (event.total) setProgress(Math.round((event.loaded / event.total) * 100));
      },
    });
      
    // 3️⃣ Save metadata to Supabase (مع إضافة المدة)
    const { data: savedVideo } = await axios.post("/api/bunny/save", {
      title,
      courseId,
      bunnyLibraryId: libraryId,
      bunnyVideoId: guid,
      thumbnailUrl: `${process.env.NEXT_PUBLIC_BUNNY_VIDEO_CDN}/${guid}/thumbnail.jpg`,
      duration: Math.round(durationInSeconds), // 👈 إضافة المدة هنا
    });
      // 4️⃣ Add the new video to the parent list instantly
      const newVideo: VideoType = {
        id: savedVideo.id, // make sure your save API returns the id
        course_id: courseId,
        title,
        description: "",
        bunny_video_id: guid,
        thumbnail_url: `${process.env.NEXT_PUBLIC_BUNNY_VIDEO_CDN}/${guid}/thumbnail.jpg`,
        created_at: new Date().toISOString(),
        attachment_url: null,
        bunny_library_id: null,
        chapter_id: null,
        duration: null,
        external_url: null,
        order_index: null,
        youtube_id: ""
      };

      onUploadSuccess?.(newVideo);

      toast.success("Video uploaded successfully!");
      reset();
    } catch (err: unknown) {
      console.error("Upload Error:", err);
      toast.error("Upload failed. Check console for details.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-6 bg-card rounded-2xl shadow-md border max-w-lg mx-auto">
      <h2 className="text-lg font-semibold text-center flex items-center justify-center gap-2">
        <Video className="w-5 h-5 text-primary" /> رفع فيديو جديد
      </h2>

      <div>
        <label className="text-sm font-medium mb-2 block">عنوان الفيديو</label>
        <Input placeholder="اكتب عنوان الفيديو..." {...register("title", { required: true })} />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">اختر ملف الفيديو</label>
        <Input type="file" accept="video/*" {...register("file", { required: true })} />
      </div>

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-center text-muted-foreground">{progress}%</p>
        </div>
      )}

      <Button type="submit" disabled={uploading} className="w-full flex items-center justify-center gap-2">
        {uploading ? (
          <>
            <UploadCloud className="w-4 h-4 animate-pulse" /> جاري الرفع...
          </>
        ) : (
          <>
            <UploadCloud className="w-4 h-4" /> رفع الفيديو
          </>
        )}
      </Button>
    </form>
  );
}
