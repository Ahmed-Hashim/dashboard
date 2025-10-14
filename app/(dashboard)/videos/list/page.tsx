"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlayVideoDialog } from "@/components/Videos/PlayVideoDialog";
import { EditVideoDialog } from "@/components/Videos/EditVideoDialog";
import { DeleteVideoDialog } from "@/components/Videos/DeleteVideoDialog";
import { Tables } from "@/types/database";
import { Loader2 } from "lucide-react";

// نوع الفيديو من الجدول
type Video = Tables<"course_videos">;

export default function VideoLibraryCards() {
  const COURSE_ID = 2;
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
    return (
      <div className="flex justify-center items-center py-16 text-muted-foreground">
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        جارٍ تحميل الفيديوهات...
      </div>
    );

  if (videos.length === 0)
    return (
      <p className="text-center py-10 text-muted-foreground">
        لا توجد فيديوهات حالياً
      </p>
    );

  return (
    <div dir="rtl" className="space-y-6 p-6">
      <h1 className="text-xl font-semibold text-right border-b pb-2">
        مكتبة الفيديوهات
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map((video) => (
          <Card
            key={video.id}
            className="flex flex-col overflow-hidden rounded-2xl shadow-sm border hover:shadow-md transition-all duration-300"
          >
            {/* الصورة المصغرة */}
            <div className="relative w-full h-48">
              {video.thumbnail_url ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_BUNNY_VIDEO_CDN}/${video.bunny_video_id}/thumbnail.jpg`}
                  alt={video.title}
                  fill
                  className="object-cover object-center transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              ) : (
                <div className="bg-gray-800 text-white flex items-center justify-center w-full h-full text-sm">
                  لا توجد صورة متوفرة
                </div>
              )}
            </div>

            {/* المحتوى */}
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-right truncate">
                {video.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 text-right">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {video.description ?? "لا يوجد وصف متاح"}
              </p>
            </CardContent>

            {/* الأزرار */}
            <CardFooter className="flex gap-2 justify-end border-t pt-3">
              <PlayVideoDialog
                videoId={video.bunny_video_id ?? ""}
                title={video.title}
              />
              <EditVideoDialog
                video={video}
                onUpdate={(updated) =>
                  setVideos((prev) =>
                    prev.map((v) =>
                      v.id === video.id ? { ...v, ...updated } : v
                    )
                  )
                }
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
