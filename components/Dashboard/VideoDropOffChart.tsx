// components/VideoDropOffChart.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface DropOffData {
  time: number; // دقيقة أو نسبة الفيديو
  watchRate: number; // نسبة المشاهدة
}

interface VideoDropOffChartProps {
  data: DropOffData[];
}

export const VideoDropOffChart = ({ data }: VideoDropOffChartProps) => (
  <Card className="p-6">
    <CardHeader>
      <CardTitle>تحليل فقدان الاهتمام في الفيديو</CardTitle>
    </CardHeader>
    <CardContent className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="time" stroke="#888888" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="watchRate" stroke="#f43f5e" />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);
