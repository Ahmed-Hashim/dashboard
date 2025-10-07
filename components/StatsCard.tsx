import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function StatsCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <Card className={`bg-gradient-to-br ${color} p-4 shadow-lg transition-all duration-300`}>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-white">{value}</div>
      </CardContent>
    </Card>
  );
}
