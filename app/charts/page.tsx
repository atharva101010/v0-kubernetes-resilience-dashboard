"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ChartPlaceholder } from "@/components/chart-placeholder"
import { ChaosControlPanel } from "@/components/chaos-control-panel"
import { useDashboard } from "@/lib/dashboard-context"

export default function ChartsPage() {
  const { state, dispatch } = useDashboard()

  const handleTriggerFailure = () => {
    dispatch({ type: "TRIGGER_SIMULATION" })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Performance & Chaos</h1>
          <p className="text-muted-foreground">Live metrics and chaos engineering controls</p>
        </div>

        {/* Performance Charts */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Live Performance Metrics</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ChartPlaceholder title="CPU Usage" type="cpu" currentValue="45%" trend="stable" />
            <ChartPlaceholder title="Memory Usage" type="memory" currentValue="1.2GB" trend="up" />
            <ChartPlaceholder
              title="Request Rate"
              type="requests"
              currentValue="1,247"
              trend={state.systemStatus === "crash-detected" ? "down" : "stable"}
            />
          </div>
        </div>

        {/* Chaos Control Panel */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Chaos Engineering</h2>
          <ChaosControlPanel onTriggerFailure={handleTriggerFailure} isSimulationRunning={state.isSimulationRunning} />
        </div>

        {/* Integration Instructions */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">Integration Guide</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div>
              <strong className="text-foreground">Chart Integration:</strong> Replace chart placeholders with Grafana
              embeds or chart libraries like Chart.js/Recharts connected to your metrics API.
            </div>
            <div>
              <strong className="text-foreground">Chaos Control:</strong> Connect the trigger button to your chaos
              engineering platform (Chaos Monkey, Litmus, Gremlin) via API calls.
            </div>
            <div>
              <strong className="text-foreground">Real-time Updates:</strong> Implement WebSocket connections or polling
              to update metrics and system status in real-time.
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
