// components/Chapters/ChapterList.tsx
"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Film, PlusCircle } from "lucide-react";
import { ChapterWithVideos, Chapter, Video } from "@/app/(dashboard)/chapters/page";
// استيراد المكون الجديد
import { AssignVideoDialog } from "./AssignVideoDialog";

type ChapterListProps = {
  chapters: ChapterWithVideos[];
  courseId: number;
  onEditChapter: (chapter: ChapterWithVideos) => void;
  onDeleteChapter: (chapter: Chapter) => void;
  onEditVideo: (video: Video) => void;
  onDeleteVideo: (video: Video) => void;
  onVideosAssigned: (assignedVideos: Video[]) => void;
};

export function ChapterList({
  chapters,
  courseId,
  onEditChapter,
  onDeleteChapter,
  onEditVideo,
  onDeleteVideo,
  onVideosAssigned,
}: ChapterListProps) {
  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {chapters.map((chapter) => (
        <AccordionItem value={`chapter-${chapter.id}`} key={chapter.id} className="border-b-0">
          {/* ... (رأس الفصل يبقى كما هو) ... */}
          <div className="flex items-center justify-between w-full rounded-lg hover:bg-muted/50 transition-colors group">
            <AccordionTrigger className="flex-1 p-4 text-right hover:no-underline ">
              <div className="flex items-center gap-4">
                <Badge variant="secondary">{chapter.order_index}</Badge>
                <span className="font-semibold text-lg">{chapter.title}</span>
                <Badge variant="outline">
                  {chapter.course_videos.length} فيديوهات
                </Badge>
              </div>
            </AccordionTrigger>
            <div className="flex gap-1 pr-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEditChapter(chapter)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteChapter(chapter)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
          
          <AccordionContent className="p-4 space-y-3">
            {/* عرض الفيديوهات المرتبطة حاليًا */}
            {chapter.course_videos.map((video) => (
                <div key={video.id} className="flex items-center justify-between p-3 rounded-md bg-muted/30 hover:bg-muted/60">
                  <div className="flex items-center gap-3">
                    <Film className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{video.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">الترتيب: {video.order_index}</Badge>
                    <Button variant="ghost" size="icon" onClick={() => onEditVideo(video)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDeleteVideo(video)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
            ))}

            {/* زر ربط الفيديوهات */}
            <AssignVideoDialog
              chapterId={chapter.id}
              courseId={courseId}
              onVideosAssigned={onVideosAssigned}
              trigger={
                <Button variant="outline" className="w-full mt-4">
                  <PlusCircle className="ml-2 h-4 w-4" />
                  ربط فيديو موجود بهذا الفصل
                </Button>
              }
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}