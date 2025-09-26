"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Zap, AlertTriangle, Play, Square, RotateCcw } from "lucide-react"

interface ChaosControlPanelProps {
  onTriggerFailure: () => void
  isSimulationRunning: boolean
  className?: string
}

export function ChaosControlPanel({ onTriggerFailure, isSimulationRunning, className }: ChaosControlPanelProps) {
  const [lastSimulation, setLastSimulation] = useState<Date | null>(null)
  const [simulationProgress, setSimulationProgress] = useState(0)

  const handleTriggerFailure = () => {
    setLastSimulation(new Date())
    setSimulationProgress(0)
    onTriggerFailure()

    // Simulate progress animation
    const interval = setInterval(() => {
      setSimulationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-400" />
          Chaos Engineering Control Panel
          {isSimulationRunning && (
            <Badge variant="destructive" className="animate-pulse">
              Simulation Active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Trigger Button */}
        <div className="flex flex-col items-center space-y-4">
          <Button
            size="lg"
            variant={isSimulationRunning ? "destructive" : "default"}
            className={cn(
              "h-16 px-8 text-lg font-semibold transition-all duration-300",
              isSimulationRunning
                ? "bg-red-600 hover:bg-red-700 animate-pulse"
                : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl",
            )}
            onClick={handleTriggerFailure}
            disabled={isSimulationRunning}
          >
            {isSimulationRunning ? (
              <>
                <Square className="mr-2 h-5 w-5" />
                Simulation Running...
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                Simulate Failure (Trigger Crash)
              </>
            )}
          </Button>

          {isSimulationRunning && (
            <div className="w-full max-w-xs space-y-2">
              <Progress value={simulationProgress} className="h-2" />
              <div className="text-xs text-center text-muted-foreground">Recovery Progress: {simulationProgress}%</div>
            </div>
          )}
        </div>

        {/* Simulation Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Failure Types</h4>
            <div className="space-y-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs bg-transparent"
                disabled={isSimulationRunning}
              >
                <AlertTriangle className="mr-2 h-3 w-3" />
                Pod Crash
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs bg-transparent"
                disabled={isSimulationRunning}
              >
                <AlertTriangle className="mr-2 h-3 w-3" />
                Network Partition
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs bg-transparent"
                disabled={isSimulationRunning}
              >
                <AlertTriangle className="mr-2 h-3 w-3" />
                Memory Exhaustion
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Target Selection</h4>
            <div className="space-y-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs bg-transparent"
                disabled={isSimulationRunning}
              >
                Random Pod
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs bg-transparent"
                disabled={isSimulationRunning}
              >
                Specific Pod
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs bg-transparent"
                disabled={isSimulationRunning}
              >
                All Pods
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Recovery Mode</h4>
            <div className="space-y-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs bg-transparent"
                disabled={isSimulationRunning}
              >
                <RotateCcw className="mr-2 h-3 w-3" />
                Auto-Heal
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs bg-transparent"
                disabled={isSimulationRunning}
              >
                Manual Recovery
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs bg-transparent"
                disabled={isSimulationRunning}
              >
                Delayed Recovery
              </Button>
            </div>
          </div>
        </div>

        {/* Last Simulation Info */}
        {lastSimulation && (
          <div className="bg-muted/30 p-3 rounded-lg border-l-2 border-primary/50">
            <div className="text-sm font-medium text-foreground">Last Simulation</div>
            <div className="text-xs text-muted-foreground">Triggered at: {lastSimulation.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">
              Status: {isSimulationRunning ? "In Progress" : "Completed"}
            </div>
          </div>
        )}

        {/* Warning Notice */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-yellow-200">
              <strong>Demo Mode:</strong> This triggers visual state changes for demonstration. In production, this
              would interface with chaos engineering tools like Chaos Monkey or Litmus.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
