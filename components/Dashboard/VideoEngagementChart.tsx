// components/Dashboard/VideoEngagementChart.tsx

"use client"

import * as React from "react"
import { Loader2, TrendingUp, Play } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/lib/supabaseClient"

interface VideoEngagementData {
  video_id: string;
  video_title: string;
  total_views: number;
  fill: string;
}

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

export function VideoEngagementChart() {
  const [data, setData] = React.useState<VideoEngagementData[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  
  const [limit, setLimit] = React.useState<"10" | "5" | "20">("10")
  const [sortOrder, setSortOrder] = React.useState<"desc" | "asc">("desc")

  React.useEffect(() => {
    const fetchVideoData = async () => {
      setLoading(true)
      setError(null)
      const { data: videoData, error: videoError } = await supabase.rpc(
        "admin_video_views",
        {
          p_limit: parseInt(limit),
          p_sort_order: sortOrder,
        }
      )
      
      if (videoError) {
        console.error("Error fetching video data:", videoError)
        setError("فشل في تحميل بيانات الفيديوهات.")
        setData([])
      } else {
        const sortedData = sortOrder === 'asc' ? (videoData || []).reverse() : videoData || [];
        const dataWithColors = sortedData.map((item: VideoEngagementData, index: number) => ({
          ...item,
          fill: COLORS[index % COLORS.length],
        }));
        setData(dataWithColors)
      }
      setLoading(false)
    }
    fetchVideoData()
  }, [limit, sortOrder])

  const totalViews = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.total_views, 0)
  }, [data])

  const maxViews = React.useMemo(() => {
    return Math.max(...data.map(item => item.total_views), 0)
  }, [data])

  return (
    <Card>
      <CardHeader className="flex flex-col items-start gap-4 space-y-0 border-b py-5 sm:flex-row sm:items-center sm:gap-2">
        <div className="grid flex-1 gap-1">
          <CardTitle>أداء الفيديوهات</CardTitle>
          <CardDescription>تحليل تفاعلي لمشاهدات المحتوى</CardDescription>
        </div>
        <div className="flex gap-2">
          <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "desc" | "asc")}>
            <SelectTrigger className="w-[140px] rounded-lg" aria-label="Sort order">
              <SelectValue placeholder="الترتيب" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="desc" className="rounded-lg">الأكثر مشاهدة</SelectItem>
              <SelectItem value="asc" className="rounded-lg">الأقل مشاهدة</SelectItem>
            </SelectContent>
          </Select>
          <Select value={limit} onValueChange={(value) => setLimit(value as "10" | "5" | "20")}>
            <SelectTrigger className="w-[120px] rounded-lg" aria-label="Number of items">
              <SelectValue placeholder="العدد" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="5" className="rounded-lg">أفضل 5</SelectItem>
              <SelectItem value="10" className="rounded-lg">أفضل 10</SelectItem>
              <SelectItem value="20" className="rounded-lg">أفضل 20</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex h-[450px] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error || data.length === 0 ? (
          <div className="flex h-[450px] w-full items-center justify-center text-muted-foreground">
            {error || "لا توجد بيانات لعرضها."}
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((video, index) => (
              <div key={video.video_id} className="group">
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: video.fill }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                      {video.video_title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Play className="h-4 w-4 text-muted-foreground" />
                    <span>{video.total_views.toLocaleString('ar-EG')}</span>
                  </div>
                </div>
                <div className="relative h-8 w-full overflow-hidden rounded-lg bg-secondary/20">
                  <div
                    className="h-full rounded-lg transition-all duration-500 ease-out"
                    style={{
                      width: `${(video.total_views / maxViews) * 100}%`,
                      backgroundColor: video.fill,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm border-t pt-4">
        <div className="flex gap-2 font-medium leading-none">
          {sortOrder === 'desc' ? "الفيديوهات الرائجة" : "فرص للتحسين"}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          إجمالي {totalViews.toLocaleString('ar-EG')} مشاهدة للفيديوهات المعروضة
        </div>
      </CardFooter>
    </Card>
  )
}