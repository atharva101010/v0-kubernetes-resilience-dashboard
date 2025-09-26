"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react"

export type SystemStatus = "healthy" | "crash-detected" | "recovering"

interface SystemStatusCardProps {
  status: SystemStatus
  className?: string
}

const statusConfig = {
  healthy: {
    label: "Healthy",
    icon: CheckCircle,
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    textColor: "text-green-400",
    badgeVariant: "default" as const,
    pulseColor: "bg-green-400",
  },
  "crash-detected": {
    label: "CRASH DETECTED",
    icon: XCircle,
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    textColor: "text-red-400",
    badgeVariant: "destructive" as const,
    pulseColor: "bg-red-400",
  },
  recovering: {
    label: "RECOVERING",
    icon: AlertTriangle,
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    textColor: "text-yellow-400",
    badgeVariant: "secondary" as const,
    pulseColor: "bg-yellow-400",
  },
}

export function SystemStatusCard({ status, className }: SystemStatusCardProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-500",
        config.bgColor,
        config.borderColor,
        className,
      )}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">System Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Icon className={cn("h-8 w-8", config.textColor)} />
              {status !== "healthy" && (
                <div className={cn("absolute -top-1 -right-1 h-3 w-3 rounded-full animate-pulse", config.pulseColor)} />
              )}
            </div>
            <div>
              <div className={cn("text-2xl font-bold", config.textColor)}>{config.label}</div>
              <div className="text-xs text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</div>
            </div>
          </div>
          <Badge variant={config.badgeVariant} className="text-xs">
            {status === "healthy" ? "STABLE" : status === "crash-detected" ? "CRITICAL" : "HEALING"}
          </Badge>
        </div>

        {/* Status ring animation */}
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "absolute inset-y-0 left-0 rounded-full transition-all duration-1000",
              status === "healthy"
                ? "w-full bg-green-400"
                : status === "crash-detected"
                  ? "w-1/4 bg-red-400"
                  : "w-3/4 bg-yellow-400 animate-pulse",
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
