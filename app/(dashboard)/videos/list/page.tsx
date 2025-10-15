"use client";

import Image from "next/image";
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
import { Video } from "@/app/(dashboard)/chapters/page";

type Props = {
  videos: Video[];
  setVideos: React.Dispatch<React.SetStateAction<Video[]>>;
};

export default function VideoLibraryCards({ videos, setVideos }: Props) {
  if (!videos.length)
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
            key={video.id ?? video.bunny_video_id}
            className="flex flex-col overflow-hidden rounded-2xl shadow-sm border hover:shadow-md transition-all duration-300"
          >
            <div className="relative w-full h-48">
              {video.thumbnail_url ? (
                <Image
                  src={video.thumbnail_url}
                  alt={video.title}
                  fill
                  className="object-cover object-center transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <div className="bg-gray-800 text-white flex items-center justify-center w-full h-full text-sm">
                  لا توجد صورة متوفرة
                </div>
              )}
            </div>

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
