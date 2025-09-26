"use client"

import type React from "react"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { SystemStatus } from "@/components/system-status-card"
import type { PodStatus } from "@/components/pod-grid"
import type { EventLogEntry } from "@/components/event-log-table"

interface Pod {
  id: string
  name: string
  status: PodStatus
}

interface DashboardState {
  systemStatus: SystemStatus
  pods: Pod[]
  activePods: number
  averageLatency: number
  predictionStatus: "stable" | "warning"
  events: EventLogEntry[]
  isSimulationRunning: boolean
  lastSimulationTime: Date | null
}

type DashboardAction =
  | { type: "TRIGGER_SIMULATION" }
  | { type: "START_RECOVERY" }
  | { type: "COMPLETE_RECOVERY" }
  | { type: "UPDATE_LATENCY"; payload: number }
  | { type: "ADD_EVENT"; payload: EventLogEntry }

const initialState: DashboardState = {
  systemStatus: "healthy",
  pods: [
    { id: "1", name: "pod-1", status: "running" },
    { id: "2", name: "pod-2", status: "running" },
    { id: "3", name: "pod-3", status: "running" },
  ],
  activePods: 3,
  averageLatency: 45,
  predictionStatus: "stable",
  events: [
    {
      id: "1",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      eventType: "Pod Killed",
      targetPod: "microservice-pod-1",
      recoveryDuration: 12,
      severity: "high",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 1000 * 60 * 5 + 1000 * 15),
      eventType: "Auto-Restart",
      targetPod: "microservice-pod-1",
      recoveryDuration: 8,
      severity: "medium",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      eventType: "High Latency",
      targetPod: "microservice-pod-2",
      recoveryDuration: 45,
      severity: "medium",
    },
    {
      id: "4",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      eventType: "Memory Spike",
      targetPod: "microservice-pod-3",
      recoveryDuration: 23,
      severity: "high",
    },
    {
      id: "5",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      eventType: "Network Error",
      targetPod: "microservice-pod-1",
      recoveryDuration: 67,
      severity: "critical",
    },
    {
      id: "6",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      eventType: "Health Check Failed",
      targetPod: "microservice-pod-2",
      recoveryDuration: 34,
      severity: "medium",
    },
  ],
  isSimulationRunning: false,
  lastSimulationTime: null,
}

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case "TRIGGER_SIMULATION": {
      // Select a random pod to crash
      const runningPods = state.pods.filter((pod) => pod.status === "running")
      if (runningPods.length === 0) return state

      const targetPod = runningPods[Math.floor(Math.random() * runningPods.length)]
      const updatedPods = state.pods.map((pod) =>
        pod.id === targetPod.id ? { ...pod, status: "crashed" as PodStatus } : pod,
      )

      // Add crash event
      const crashEvent: EventLogEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        eventType: "Pod Killed",
        targetPod: targetPod.name,
        recoveryDuration: 0, // Will be updated when recovery completes
        severity: "high",
      }

      return {
        ...state,
        systemStatus: "crash-detected",
        pods: updatedPods,
        activePods: state.activePods - 1,
        averageLatency: state.averageLatency + 50, // Simulate latency spike
        predictionStatus: "warning",
        isSimulationRunning: true,
        lastSimulationTime: new Date(),
        events: [crashEvent, ...state.events],
      }
    }

    case "START_RECOVERY": {
      const crashedPods = state.pods.filter((pod) => pod.status === "crashed")
      if (crashedPods.length === 0) return state

      const updatedPods = state.pods.map((pod) =>
        pod.status === "crashed" ? { ...pod, status: "restarting" as PodStatus } : pod,
      )

      return {
        ...state,
        systemStatus: "recovering",
        pods: updatedPods,
      }
    }

    case "COMPLETE_RECOVERY": {
      const restartingPods = state.pods.filter((pod) => pod.status === "restarting")
      if (restartingPods.length === 0) return state

      const updatedPods = state.pods.map((pod) =>
        pod.status === "restarting" ? { ...pod, status: "running" as PodStatus } : pod,
      )

      // Add recovery event and update the crash event with recovery duration
      const recoveryDuration = state.lastSimulationTime
        ? Math.round((Date.now() - state.lastSimulationTime.getTime()) / 1000)
        : 15

      const recoveryEvent: EventLogEntry = {
        id: (Date.now() + 1).toString(),
        timestamp: new Date(),
        eventType: "Auto-Restart",
        targetPod: restartingPods[0].name,
        recoveryDuration,
        severity: "medium",
      }

      // Update the most recent crash event with recovery duration
      const updatedEvents = state.events.map((event, index) =>
        index === 0 && event.eventType === "Pod Killed" && event.recoveryDuration === 0
          ? { ...event, recoveryDuration }
          : event,
      )

      return {
        ...state,
        systemStatus: "healthy",
        pods: updatedPods,
        activePods: 3,
        averageLatency: Math.max(30, state.averageLatency - 40), // Normalize latency
        predictionStatus: "stable",
        isSimulationRunning: false,
        events: [recoveryEvent, ...updatedEvents],
      }
    }

    case "UPDATE_LATENCY":
      return {
        ...state,
        averageLatency: action.payload,
      }

    case "ADD_EVENT":
      return {
        ...state,
        events: [action.payload, ...state.events],
      }

    default:
      return state
  }
}

const DashboardContext = createContext<{
  state: DashboardState
  dispatch: React.Dispatch<DashboardAction>
} | null>(null)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState)

  // Simulate the recovery sequence when a simulation is triggered
  useEffect(() => {
    if (state.isSimulationRunning && state.systemStatus === "crash-detected") {
      // Start recovery after 1 second
      const recoveryTimer = setTimeout(() => {
        dispatch({ type: "START_RECOVERY" })
      }, 1000)

      return () => clearTimeout(recoveryTimer)
    }
  }, [state.isSimulationRunning, state.systemStatus])

  useEffect(() => {
    if (state.systemStatus === "recovering") {
      // Complete recovery after 3 seconds
      const completeTimer = setTimeout(() => {
        dispatch({ type: "COMPLETE_RECOVERY" })
      }, 3000)

      return () => clearTimeout(completeTimer)
    }
  }, [state.systemStatus])

  // Simulate random latency fluctuations
  useEffect(() => {
    if (!state.isSimulationRunning) {
      const interval = setInterval(() => {
        const change = (Math.random() - 0.5) * 10
        const newLatency = Math.max(30, Math.min(100, state.averageLatency + change))
        dispatch({ type: "UPDATE_LATENCY", payload: newLatency })
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [state.isSimulationRunning, state.averageLatency])

  return <DashboardContext.Provider value={{ state, dispatch }}>{children}</DashboardContext.Provider>
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}
