// components/Dashboard/EnrollmentChart.tsx

"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Loader2 } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
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

// 1. تحديث نوع البيانات ليعكس المقياسين
interface DailyGrowthData {
  date: string;
  new_users: number;
  new_enrollments: number;
}

// 2. تحديث إعدادات الشارت لتشمل المقياسين بألوان مختلفة
const chartConfig = {
  new_users: {
    label: "مستخدمون جدد",
    color: "var(--chart-1)", // اللون الأزرق
  },
  new_enrollments: {
    label: "اشتراكات جديدة",
    color: "var(--chart-2)", // اللون الأخضر
  },
} satisfies ChartConfig

// تم تغيير اسم المكون ليعكس وظيفته الجديدة بشكل أفضل
export function EnrollmentChart() {
  const [timeRange, setTimeRange] = React.useState<"90" | "30" | "7">("30")
  const [data, setData] = React.useState<DailyGrowthData[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // 3. تغيير استدعاء RPC لاستخدام الدالة الأقوى
  React.useEffect(() => {
    const fetchGrowthData = async () => {
      setLoading(true)
      setError(null)
      // نستخدم الدالة التي تقارن بين المستخدمين والاشتراكات
      const { data: growthData, error: growthError } = await supabase.rpc(
        "get_daily_growth_comparison",
        { days: parseInt(timeRange) }
      )

      if (growthError) {
        console.error("Error fetching growth data:", growthError)
        setError("فشل في تحميل بيانات النمو.")
        setData([])
      } else {
        setData(growthData || [])
      }
      setLoading(false)
    }

    fetchGrowthData()
  }, [timeRange])

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          {/* 4. تحديث العناوين لتعكس المحتوى الجديد */}
          <CardTitle>تحليل النمو</CardTitle>
          <CardDescription>
            مقارنة بين المستخدمين الجدد والاشتراكات الجديدة
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
            // 5. تحديث المخطط ليعرض منطقتين مكدستين (Stacked Areas)
            <AreaChart data={data}>
              <defs>
                <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-new_users)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-new_users)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillEnrollments" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-new_enrollments)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-new_enrollments)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false} axisLine={false} tickMargin={8} minTickGap={32}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("ar-EG", { month: "short", day: "numeric" })
                }
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="new_enrollments"
                type="natural"
                fill="url(#fillEnrollments)"
                stroke="var(--color-new_enrollments)"
                stackId="a"
              />
              <Area
                dataKey="new_users"
                type="natural"
                fill="url(#fillUsers)"
                stroke="var(--color-new_users)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}