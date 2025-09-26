"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { EventLogTable } from "@/components/event-log-table"
import { useDashboard } from "@/lib/dashboard-context"

export default function LogsPage() {
  const { state } = useDashboard()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Incident History</h1>
          <p className="text-muted-foreground">Chaos & incident log with recovery details</p>
        </div>

        <EventLogTable events={state.events} />
      </div>
    </DashboardLayout>
  )
}
