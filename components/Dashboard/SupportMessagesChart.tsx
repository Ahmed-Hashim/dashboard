// components/Dashboard/SupportMessagesChart.tsx

"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Loader2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/lib/supabaseClient"

interface DailySupportData {
  date: string;
  count: number;
}

const chartConfig = {
  messages: {
    label: "رسائل جديدة",
    color: "var(--chart-4)", // اللون الأصفر/البرتقالي
  },
} satisfies ChartConfig

export function SupportMessagesChart() {
  const [timeRange, setTimeRange] = React.useState<"90" | "30" | "7">("30")
  const [data, setData] = React.useState<DailySupportData[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchSupportData = async () => {
      setLoading(true)
      setError(null)
      // الدالة get_daily_support_messages يجب أن تكون موجودة
      const { data: supportData, error: supportError } = await supabase.rpc(
        "get_daily_support_messages",
        { days: parseInt(timeRange) }
      )
      
      if (supportError) {
        console.error("Error fetching support data:", supportError)
        setError("فشل في تحميل بيانات الدعم.")
        setData([])
      } else {
        setData(supportData || [])
      }
      setLoading(false)
    }

    fetchSupportData()
  }, [timeRange])

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>تذاكر الدعم</CardTitle>
          <CardDescription>
            عدد رسائل الدعم الجديدة في الفترة المحددة
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={(value) => setTimeRange(value as "90" | "30" | "7")}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a value">
            <SelectValue placeholder="اختر فترة" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90" className="rounded-lg">آخر 90 يوم</SelectItem>
            <SelectItem value="30" className="rounded-lg">آخر 30 يوم</SelectItem>
            <SelectItem value="7" className="rounded-lg">آخر 7 أيام</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          {loading ? (
            <div className="flex h-full w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error || data.length === 0 ? (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              {error || "لا توجد بيانات لعرضها."}
            </div>
          ) : (
            <BarChart data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false} axisLine={false} tickMargin={8}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("ar-EG", { day: "numeric" })
                }
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="count" fill="var(--color-messages)" radius={4} name="رسائل"/>
            </BarChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}