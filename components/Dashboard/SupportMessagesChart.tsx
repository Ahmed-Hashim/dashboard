// components/SupportMessagesChart.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface SupportData {
  date: string;
  messages: number;
}

interface SupportMessagesChartProps {
  data: SupportData[];
}

export const SupportMessagesChart = ({ data }: SupportMessagesChartProps) => (
  <Card className="p-6">
    <CardHeader>
      <CardTitle>رسائل الدعم حسب الوقت</CardTitle>
    </CardHeader>
    <CardContent className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="date" stroke="#888888" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="messages" fill="#f43f5e" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);
