"use client";

import { useEffect, useState } from "react";
import { Video } from "@/app/(dashboard)/chapters/page";
import VideoLibraryCards from "./list/page";
import VideoUploader from "@/components/Videos/VideoUploader";
import { supabase } from "@/lib/supabaseClient";

export default function ManageVideosPage() {
  const COURSE_ID = 2;
  const [videos, setVideos] = useState<Video[]>([]);
  useEffect(() => {
    const fetchVideos = async () => {
      const { data } = await supabase
        .from("course_videos")
        .select("*")
        .eq("course_id", COURSE_ID)
        .order("created_at", { ascending: false });
      
      if (data) setVideos(data);
    };
    fetchVideos();
  }, []);
  const handleUploadSuccess = (newVideo: Video) => {
    setVideos((prev) => [newVideo, ...prev]);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">إدارة الفيديوهات</h1>
          <p className="text-muted-foreground">
            رفع فيديوهات جديدة وعرض الفيديوهات غير المرتبطة بأي فصل.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <div className="lg:col-span-1">
            <VideoUploader
              courseId={COURSE_ID}
              onUploadSuccess={handleUploadSuccess}
            />
          </div>

          <div className="lg:col-span-1 space-y-4">
            <VideoLibraryCards videos={videos} setVideos={setVideos} />
          </div>
        </div>
      </div>
    </div>
  );
}
