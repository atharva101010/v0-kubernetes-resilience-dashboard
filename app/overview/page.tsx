"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { SystemStatusCard } from "@/components/system-status-card"
import { ServiceMetrics } from "@/components/service-metrics"
import { PodGrid } from "@/components/pod-grid"
import { useDashboard } from "@/lib/dashboard-context"

export default function OverviewPage() {
  const { state } = useDashboard()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Overview</h1>
          <p className="text-muted-foreground">Real-time status of your Kubernetes microservice</p>
        </div>

        {/* System Status - Large prominent card */}
        <SystemStatusCard status={state.systemStatus} className="md:col-span-2 lg:col-span-3" />

        {/* Service Metrics */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Service Metrics</h2>
          <ServiceMetrics
            activePods={state.activePods}
            totalPods={3}
            averageLatency={Math.round(state.averageLatency)}
            predictionStatus={state.predictionStatus}
          />
        </div>

        {/* Pod Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Pod Status</h2>
          <PodGrid pods={state.pods} />
        </div>
      </div>
    </DashboardLayout>
  )
}
