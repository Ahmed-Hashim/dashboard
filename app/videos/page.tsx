"use client";

import {  useState } from "react";
import { VideoUploader } from "@/components/Videos/VideoUploader";
import { Video } from "@/app/(dashboard)/chapters/page";
import VideoLibraryCards from "./list/page";

export default function ManageVideosPage() {
  const COURSE_ID = 1;
  const [unassignedVideos, setUnassignedVideos] = useState<Video[]>([]);
 
  

  const handleUploadSuccess = (newVideo: Video) => {
    setUnassignedVideos((prev) => [newVideo, ...prev]);
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
          {/* قسم الرفع */}
          <div className="lg:col-span-1">
            <VideoUploader
              courseId={COURSE_ID}
              onUploadSuccess={(data) => {
                const newVideo: Video = {
                  id: data.id.toString(),
                  title: data.title,
                  course_id: data.courseId,
                  bunny_video_id: data.bunnyVideoId,
                  bunny_library_id: data.bunnyLibraryId,
                  created_at: data.createdAt,
                  duration: null,
                  external_url: null,
                  chapter_id: null,
                  youtube_id: "",
                  thumbnail_url: null,
                  order_index: data.id,
                  attachment_url: null,
                  description: null,
                };
                 
                handleUploadSuccess(newVideo);
              }}
            />
          </div>

          {/* قسم عرض الفيديوهات المتاحة */}
          <div className="lg:col-span-1 space-y-4">
            <VideoLibraryCards/>
          </div>
        </div>
      </div>
    </div>
  );
}
