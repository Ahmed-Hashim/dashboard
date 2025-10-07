"use client";
import { useState, useRef, FormEvent } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Loader2, UploadCloud } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Props = {
  courseId: number;
  onUploadSuccess: (data: {
    id: number;
    title: string;
    courseId: number;
    bunnyVideoId: string;
    bunnyLibraryId: string;
    createdAt: string;
  }) => void;
};

export function VideoUploader({ courseId, onUploadSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file || !title) return setError("يرجى إدخال العنوان واختيار الفيديو.");

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Step 1️⃣: Create Bunny upload URL
      const { data: bunny } = await axios.post(
        "/api/videos/create-upload-url",
        { title }
      );
      if (!bunny.uploadUrl || !bunny.guid)
        throw new Error("لم يتم إنشاء رابط الرفع.");

      // Step 3️⃣: Save record to Supabase
      const { data: saved } = await axios.post("/api/videos/save", {
        title,
        courseId,
        bunnyLibraryId: bunny.libraryId,
        bunnyVideoId: bunny.guid,
      });

      onUploadSuccess(saved);
      setTitle("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err: unknown) {
      console.error("Upload error:", err);
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error ||
            err.message ||
            "حدث خطأ أثناء رفع الفيديو."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("حدث خطأ أثناء رفع الفيديو.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>رفع فيديو جديد</CardTitle>
        <CardDescription>ارفع الفيديو مباشرة إلى Bunny CDN</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label className="py-4">عنوان الفيديو</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
            />
          </div>

          <div>
            <Label className="py-4">ملف الفيديو</Label>
            <Input
              type="file"
              accept="video/*"
              ref={fileRef}
              onChange={handleFileChange}
              disabled={isUploading}
            />
            {file && <p className="text-sm mt-2">{file.name}</p>}
          </div>

          {isUploading && (
            <>
              <Progress value={uploadProgress} />
              <p className="text-sm text-center">{uploadProgress}%</p>
            </>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex justify-center py-4 items-center">
          <Button type="submit" className="w-[25%]" disabled={isUploading}>
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="mr-2 h-4 w-4" />
            )}
            {isUploading ? "جاري الرفع..." : "رفع الفيديو"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
