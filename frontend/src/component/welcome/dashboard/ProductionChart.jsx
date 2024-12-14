"use client"

import * as React from "react"
import { Line, LineChart, Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer } from "@/components/ui/chart"
import { MoreVertical } from 'lucide-react'
import { Button } from "@/components/ui/button"

const activityData = [
  { month: "Jan", hours: 8.5 },
  { month: "Feb", hours: 7.8 },
  { month: "Mar", hours: 8.2 },
  { month: "Apr", hours: 7.5 },
  { month: "May", hours: 6.8 },
  { month: "Jun", hours: 4.783, isHighlight: true },
  { month: "Jul", hours: 7.2 },
  { month: "Aug", hours: 6.9 },
  { month: "Sep", hours: 7.8 },

]

const leadSourceData = [
  { month: 1, value: 1000 },
  { month: 2, value: 2000 },
  { month: 3, value: 3200 },
  { month: 4, value: 4800 },
  { month: 5, value: 6000 },
  { month: 6, value: 7500 },
  { month: 7, value: 7500 },
]

export default function ProductionChart() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <CardTitle className="text-base font-normal">Learning Activity</CardTitle>
          <Select defaultValue="yearly">
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <ChartContainer
            className="h-[300px]"
            config={{
              hours: {
                label: "Hours",
                color: "hsl(var(--chart-1))",
              },
            }}
          >
            <LineChart
              width={356}
              height={200}
              data={activityData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                ticks={[4, 6, 8, 10, 12]}
                domain={[4, 12]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              View
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {payload[0].value}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="hours"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorHours)"
              />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 8,
                  fill: "hsl(var(--chart-1))",
                  strokeWidth: 0,
                }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <CardTitle className="text-base font-normal">Lead Source</CardTitle>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[hsl(var(--chart-1))]" />
              <div>
                <div className="text-sm font-medium">Total Revenue</div>
                <div className="text-xl font-bold">45,456.00</div>
                <div className="text-xs text-muted-foreground">INR</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[hsl(var(--chart-2))]" />
              <div>
                <div className="text-sm font-medium">Total Sales</div>
                <div className="text-xl font-bold">8,550.00</div>
                <div className="text-xs text-muted-foreground">Products</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[hsl(var(--chart-3))]" />
              <div>
                <div className="text-sm font-medium">Total Views</div>
                <div className="text-xl font-bold">28,550.00</div>
                <div className="text-xs text-muted-foreground">USD</div>
              </div>
            </div>
          </div>
          <ChartContainer
            className="h-[200px]"
            config={{
              value: {
                label: "Value",
                color: "hsl(var(--chart-1))",
              },
            }}
          >
            <AreaChart
              width={356}
              height={200}
              data={leadSourceData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
