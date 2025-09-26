"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Server } from "lucide-react"

export type PodStatus = "running" | "crashed" | "restarting"

interface Pod {
  id: string
  name: string
  status: PodStatus
}

interface PodGridProps {
  pods: Pod[]
  className?: string
}

const statusConfig = {
  running: {
    bgColor: "bg-green-500",
    borderColor: "border-green-400",
    textColor: "text-green-400",
    label: "Running",
  },
  crashed: {
    bgColor: "bg-red-500",
    borderColor: "border-red-400",
    textColor: "text-red-400",
    label: "Crashed",
  },
  restarting: {
    bgColor: "bg-yellow-500",
    borderColor: "border-yellow-400",
    textColor: "text-yellow-400",
    label: "Restarting",
  },
}

export function PodGrid({ pods, className }: PodGridProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Server className="h-4 w-4" />
          Pod Status Grid
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {pods.map((pod) => {
            const config = statusConfig[pod.status]
            return (
              <div
                key={pod.id}
                className={cn(
                  "relative p-4 rounded-lg border-2 transition-all duration-500",
                  config.borderColor,
                  "bg-card hover:bg-accent/50",
                )}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="relative">
                    <Server className={cn("h-8 w-8", config.textColor)} />
                    <div
                      className={cn(
                        "absolute -top-1 -right-1 h-3 w-3 rounded-full",
                        config.bgColor,
                        pod.status === "restarting" && "animate-pulse",
                      )}
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium text-foreground">{pod.name}</div>
                    <div className={cn("text-xs", config.textColor)}>{config.label}</div>
                  </div>
                </div>

                {/* Pulse animation for restarting pods */}
                {pod.status === "restarting" && (
                  <div className="absolute inset-0 rounded-lg border-2 border-yellow-400 animate-ping opacity-20" />
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 pt-2 border-t border-border">
          {Object.entries(statusConfig).map(([status, config]) => (
            <div key={status} className="flex items-center gap-1">
              <div className={cn("h-2 w-2 rounded-full", config.bgColor)} />
              <span className="text-xs text-muted-foreground capitalize">{config.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
