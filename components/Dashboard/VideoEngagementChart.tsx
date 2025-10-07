// components/VideoEngagementChart.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface VideoData {
  title: string;
  views: number;
  avgWatchTime: number; // بالدقائق أو النسبة
}

interface VideoEngagementChartProps {
  data: VideoData[];
}

export const VideoEngagementChart = ({ data }: VideoEngagementChartProps) => (
  <Card className="p-6">
    <CardHeader>
      <CardTitle>تفاعل الفيديوهات</CardTitle>
    </CardHeader>
    <CardContent className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="title" stroke="#888888" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="views" fill="#6366f1" />
          <Bar dataKey="avgWatchTime" fill="#a855f7" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);
