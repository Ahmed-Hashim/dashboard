// components/CompletionVsActiveChart.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface CompletionData {
  date: string;
  completionRate: number;
  activeStudents: number;
}

interface CompletionVsActiveChartProps {
  data: CompletionData[];
}

export const CompletionVsActiveChart = ({ data }: CompletionVsActiveChartProps) => (
  <Card className="p-6">
    <CardHeader>
      <CardTitle>نسبة الإنجاز مقابل الطلاب النشطين</CardTitle>
    </CardHeader>
    <CardContent className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" stroke="#888888" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="completionRate" stroke="#22c55e" />
          <Line type="monotone" dataKey="activeStudents" stroke="#6366f1" />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);
