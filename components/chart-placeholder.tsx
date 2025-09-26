"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { BarChart3, TrendingUp, Activity, Cpu, MemoryStick, Zap } from "lucide-react"

interface ChartPlaceholderProps {
  title: string
  type: "cpu" | "memory" | "requests"
  currentValue: string
  trend: "up" | "down" | "stable"
  className?: string
}

const chartConfig = {
  cpu: {
    icon: Cpu,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    unit: "%",
  },
  memory: {
    icon: MemoryStick,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    unit: "MB",
  },
  requests: {
    icon: Zap,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    unit: "/min",
  },
}

const trendConfig = {
  up: { icon: TrendingUp, color: "text-green-400", label: "Trending Up" },
  down: { icon: TrendingUp, color: "text-red-400", label: "Trending Down", rotate: "rotate-180" },
  stable: { icon: Activity, color: "text-yellow-400", label: "Stable" },
}

export function ChartPlaceholder({ title, type, currentValue, trend, className }: ChartPlaceholderProps) {
  const config = chartConfig[type]
  const trendInfo = trendConfig[trend]
  const Icon = config.icon
  const TrendIcon = trendInfo.icon

  return (
    <Card className={cn("relative overflow-hidden", config.bgColor, config.borderColor, className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {title}
          </div>
          <Badge variant="outline" className="text-xs">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Value Display */}
        <div className="flex items-center justify-between">
          <div>
            <div className={cn("text-2xl font-bold", config.color)}>{currentValue}</div>
            <div className="text-xs text-muted-foreground">Current Value</div>
          </div>
          <div className="flex items-center gap-1">
            <TrendIcon className={cn("h-4 w-4", trendInfo.color, trendInfo.rotate)} />
            <span className={cn("text-xs", trendInfo.color)}>{trendInfo.label}</span>
          </div>
        </div>

        {/* Chart Placeholder Area */}
        <div className="h-32 bg-muted/20 rounded-lg border border-dashed border-muted-foreground/20 flex flex-col items-center justify-center gap-2">
          <BarChart3 className="h-8 w-8 text-muted-foreground/40" />
          <div className="text-xs text-muted-foreground text-center">
            <div>Grafana Chart Integration</div>
            <div className="text-muted-foreground/60">Connect to display live {title.toLowerCase()}</div>
          </div>
        </div>

        {/* Integration Instructions */}
        <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded border-l-2 border-primary/50">
          <strong>API Integration Point:</strong> Replace this placeholder with Grafana embed or chart component
        </div>
      </CardContent>
    </Card>
  )
}
