"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Clock, Shield } from "lucide-react"

interface ServiceMetricsProps {
  activePods: number
  totalPods: number
  averageLatency: number
  predictionStatus: "stable" | "warning"
}

export function ServiceMetrics({ activePods, totalPods, averageLatency, predictionStatus }: ServiceMetricsProps) {
  const metrics = [
    {
      title: "Active Pods",
      value: `${activePods}/${totalPods}`,
      icon: Activity,
      color: activePods === totalPods ? "text-green-400" : "text-yellow-400",
      bgColor: activePods === totalPods ? "bg-green-500/10" : "bg-yellow-500/10",
    },
    {
      title: "Average Latency",
      value: `${averageLatency}ms`,
      icon: Clock,
      color: averageLatency < 100 ? "text-green-400" : averageLatency < 200 ? "text-yellow-400" : "text-red-400",
      bgColor: averageLatency < 100 ? "bg-green-500/10" : averageLatency < 200 ? "bg-yellow-500/10" : "bg-red-500/10",
    },
    {
      title: "Failure Prediction",
      value: predictionStatus === "stable" ? "Stable" : "Warning",
      icon: Shield,
      color: predictionStatus === "stable" ? "text-green-400" : "text-yellow-400",
      bgColor: predictionStatus === "stable" ? "bg-green-500/10" : "bg-yellow-500/10",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        return (
          <Card key={index} className={`${metric.bgColor} border-border/50`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
              {metric.title === "Failure Prediction" && (
                <Badge variant={predictionStatus === "stable" ? "default" : "secondary"} className="mt-2 text-xs">
                  {predictionStatus === "stable" ? "All Systems Normal" : "Monitoring Closely"}
                </Badge>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
