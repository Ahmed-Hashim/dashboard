"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UploadCloud, Video } from "lucide-react";

type UploadFormValues = {
  title: string;
  file: FileList;
};

export default function VideoUploader({ courseId }: { courseId: number }) {
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

      // 🧠 1. Create Bunny video entry
      const { data: createData } = await axios.post("/api/bunny/create", {
        title,
      });
      const { uploadUrl, guid, libraryId } = createData;

      // 🧠 2. Upload file to Bunny video endpoint
      await axios.put(uploadUrl, file, {
        headers: { "Content-Type": "application/octet-stream",
          "AccessKey": process.env.NEXT_PUBLIC_BUNNY_API_KEY || "",
         },
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setProgress(percent);
          }
        },
      });
      console.log("Upload Response:", createData);
      
      // 🧠 3. Save metadata to Supabase
      await axios.post("/api/bunny/save", {
        title,
        courseId,
        bunnyLibraryId: libraryId,
        bunnyVideoId: guid,
        thumbnailUrl: `${process.env.NEXT_PUBLIC_BUNNY_VIDEO_CDN}/${guid}/thumbnail.jpg`,
      });

      toast.success("Video uploaded successfully!");
      reset();
    } catch (err: unknown) {
      console.error(
        "Upload Error:",
        (err as { response?: { data?: unknown }; message?: string }).response
          ?.data || (err as { message?: string }).message
      );

      toast.error("Upload failed. Check console for details.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
     <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 p-6 bg-card rounded-2xl shadow-md border max-w-lg mx-auto"
    >
      <h2 className="text-lg font-semibold text-center flex items-center justify-center gap-2">
        <Video className="w-5 h-5 text-primary" />
        رفع فيديو جديد
      </h2>

      <div>
        <label className="text-sm font-medium mb-2 block">عنوان الفيديو</label>
        <Input
          placeholder="اكتب عنوان الفيديو..."
          {...register("title", { required: true })}
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">
          اختر ملف الفيديو
        </label>
        <Input
          type="file"
          accept="video/*"
          {...register("file", { required: true })}
        />
      </div>

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-center text-muted-foreground">
            {progress}%
          </p>
        </div>
      )}

      <Button type="submit" disabled={uploading} className="w-full flex items-center justify-center gap-2">
        {uploading ? (
          <>
            <UploadCloud className="w-4 h-4 animate-pulse" />
            جاري الرفع...
          </>
        ) : (
          <>
            <UploadCloud className="w-4 h-4" />
            رفع الفيديو
          </>
        )}
      </Button>
    </form>
  );
}
