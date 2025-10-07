// app/(dashboard)/chapters/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Tables } from "@/types/database";
import { Loader2, FolderOpen } from "lucide-react";

// استيراد المكونات المنفصلة
import { ChapterList } from "@/components/Chapters/ChapterList";
import { AddChapterDialog } from "@/components/Chapters/AddChapterDialog";
import { EditChapterDialog } from "@/components/Chapters/EditChapterDialog";
import { DeleteConfirmationDialog } from "@/components/Chapters/DeleteConfirmationDialog";

// تعريف الأنواع لتمريرها للمكونات الأخرى
export type Video = Tables<"course_videos">;
export type Chapter = Tables<"course_chapters">;
export type ChapterWithVideos = Chapter & {
  course_videos: Video[];
};

export default function ManageChaptersPage() {
  const COURSE_ID = 1;

  const [chapters, setChapters] = useState<ChapterWithVideos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // حالة لإدارة النوافذ المنبثقة
  const [chapterToEdit, setChapterToEdit] = useState<ChapterWithVideos | null>(null);
  const [chapterToDelete, setChapterToDelete] = useState<Chapter | null>(null);
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);

  useEffect(() => {
    const fetchCourseContent = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("course_chapters")
        .select("*, course_videos(*)")
        .eq("course_id", COURSE_ID)
        .order("order_index", { ascending: true })
        .order("order_index", {
          foreignTable: "course_videos",
          ascending: true,
        });

      if (error) {
        console.error("Error fetching course content:", error);
        setError("حدث خطأ أثناء جلب محتوى الكورس.");
      } else {
        setChapters((data as ChapterWithVideos[]) || []);
      }
      setLoading(false);
    };

    fetchCourseContent();
  }, [COURSE_ID]);

  // دوال لتحديث الواجهة بناءً على الأحداث من المكونات الفرعية
  const handleAddChapter = (newChapter: ChapterWithVideos) => {
    setChapters((prev) => [...prev, newChapter].sort((a,b) => (a.order_index || 0) - (b.order_index || 0)));
  };

  const handleUpdateChapter = (updatedChapter: ChapterWithVideos) => {
    setChapters(prev => 
      prev.map(ch => ch.id === updatedChapter.id ? updatedChapter : ch)
    );
  };
  
  const handleAddVideo = (newVideo: Video) => {
    setChapters(prev =>
      prev.map(ch => {
        if (ch.id === newVideo.chapter_id) {
          const updatedVideos = [...ch.course_videos, newVideo]
            .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
          return { ...ch, course_videos: updatedVideos };
        }
        return ch;
      })
    );
  };

  const handleDeleteChapter = (chapterId: number) => {
    setChapters((prev) => prev.filter((ch) => ch.id !== chapterId));
  };
  
  const handleDeleteVideo = (videoId: string, chapterId: number | null) => {
    setChapters((prev) =>
      prev.map((ch) => {
        if (ch.id === chapterId) {
          return {
            ...ch,
            course_videos: ch.course_videos.filter((v) => v.id !== videoId),
          };
        }
        return ch;
      })
    );
  };
  
  // عرض حالات الواجهة المختلفة
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin w-12 h-12 text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center mt-10 text-destructive">{error}</p>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* رأس الصفحة */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">إدارة محتوى الكورس</h1>
            <p className="text-muted-foreground">
              تنظيم الفصول والفيديوهات الخاصة بالدورة التدريبية.
            </p>
          </div>
          <AddChapterDialog
            courseId={COURSE_ID}
            onChapterAdded={handleAddChapter}
            nextOrderIndex={chapters.length + 1}
          />
        </div>

        {/* عرض قائمة الفصول أو رسالة في حالة عدم وجودها */}
        {chapters.length > 0 ? (
          <ChapterList
            chapters={chapters}
            courseId={COURSE_ID}
            onEditChapter={setChapterToEdit}
            onDeleteChapter={setChapterToDelete}
            onEditVideo={(video) => alert(`تنبيه: تعديل الفيديو لم يتم تنفيذه بعد. الفيديو: ${video.title}`)}
            onDeleteVideo={setVideoToDelete}
            onVideoAdded={handleAddVideo}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center border-2 border-dashed rounded-lg p-12 mt-8">
            <FolderOpen className="w-16 h-16 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">لم يتم إضافة فصول بعد</h2>
            <p className="mt-2 text-muted-foreground">
              ابدأ ببناء الكورس عن طريق إضافة أول فصل.
            </p>
          </div>
        )}
      </div>

      {/* نافذة تعديل الفصل */}
      <EditChapterDialog
        chapter={chapterToEdit}
        onClose={() => setChapterToEdit(null)}
        onChapterUpdated={handleUpdateChapter}
      />
      
      {/* نافذة تأكيد الحذف */}
      <DeleteConfirmationDialog
        chapterToDelete={chapterToDelete}
        videoToDelete={videoToDelete}
        onClose={() => {
          setChapterToDelete(null);
          setVideoToDelete(null);
        }}
        onChapterDeleted={handleDeleteChapter}
        onVideoDeleted={handleDeleteVideo}
      />
    </div>
  );
}