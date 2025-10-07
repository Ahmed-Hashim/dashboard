// components/EnrollmentChart.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface EnrollmentData {
  date: string;
  students: number;
}

interface EnrollmentChartProps {
  data: EnrollmentData[];
}

export const EnrollmentChart = ({ data }: EnrollmentChartProps) => (
  <Card className="p-6">
    <CardHeader>
      <CardTitle>تسجيل الطلاب بمرور الوقت</CardTitle>
    </CardHeader>
    <CardContent className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <XAxis dataKey="date" stroke="#888888" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="students" stroke="#6366f1" fill="#6366f1" />
        </AreaChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);
