"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";

import { PlayVideoDialog } from "@/components/Videos/PlayVideoDialog";
import { EditVideoDialog } from "@/components/Videos/EditVideoDialog";
import { DeleteVideoDialog } from "@/components/Videos/DeleteVideoDialog";
import { Tables } from "@/types/database";

// نوع الفيديو من الجدول
type Video = Tables<"course_videos">;


export default function VideoLibraryCards() {
  const COURSE_ID = 1;
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("course_videos")
        .select("*")
        .eq("course_id", COURSE_ID)
        .order("created_at", { ascending: false });

      if (data) setVideos(data);
      setLoading(false);
    };
    fetchVideos();
  }, []);



  if (loading)
    return <p className="text-center py-8">جارٍ تحميل الفيديوهات...</p>;
  if (videos.length === 0)
    return <p className="text-center py-8">لا توجد فيديوهات حالياً</p>;

  return (
    <div dir="rtl" className="space-y-4 p-6">
      <h1 className="text-lg font-medium mb-4 text-right">مكتبة الفيديوهات</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <Card key={video.id} className="flex flex-col">
            {/* الصورة المصغرة */}
            <div className="w-full h-40 relative overflow-hidden rounded-t-md">
              {video.thumbnail_url ? (
                <Image
                  src={video.thumbnail_url}
                  alt={video.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="bg-gray-700 w-full h-full flex items-center justify-center text-white text-sm">
                  لا توجد صورة
                </div>
              )}
            </div>

            {/* المحتوى */}
            <CardContent className="flex-1 text-right">
              <CardTitle className="text-sm font-medium">
                {video.title}
              </CardTitle>
              <p className="text-muted-foreground text-xs mt-1">
                {video.description ?? "-"}
              </p>
            </CardContent>

            {/* Footer مع Actions */}
            <CardFooter className="flex gap-2 justify-end">
              <PlayVideoDialog
                videoId={video.bunny_video_id?? ""}
                title={video.title}
              />
              <EditVideoDialog
                video={video}
                onUpdate={(updated) => {
                  // تحديث الحالة محليًا بعد التعديل
                  setVideos((prev) =>
                    prev.map((v) =>
                      v.id === video.id ? { ...v, ...updated } : v
                    )
                  );
                }}
              />
              <DeleteVideoDialog
                videoId={video.id}
                onDelete={() =>
                  setVideos((prev) => prev.filter((v) => v.id !== video.id))
                }
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
