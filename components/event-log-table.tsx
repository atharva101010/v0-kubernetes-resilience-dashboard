"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Search, Filter, ArrowUpDown, Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

export interface EventLogEntry {
  id: string
  timestamp: Date
  eventType: "Pod Killed" | "Auto-Restart" | "High Latency" | "Memory Spike" | "Network Error" | "Health Check Failed"
  targetPod: string
  recoveryDuration: number // in seconds
  severity: "low" | "medium" | "high" | "critical"
}

interface EventLogTableProps {
  events: EventLogEntry[]
  className?: string
}

const eventTypeConfig = {
  "Pod Killed": { icon: XCircle, color: "text-red-400", bgColor: "bg-red-500/10" },
  "Auto-Restart": { icon: CheckCircle, color: "text-green-400", bgColor: "bg-green-500/10" },
  "High Latency": { icon: Clock, color: "text-yellow-400", bgColor: "bg-yellow-500/10" },
  "Memory Spike": { icon: AlertTriangle, color: "text-orange-400", bgColor: "bg-orange-500/10" },
  "Network Error": { icon: XCircle, color: "text-red-400", bgColor: "bg-red-500/10" },
  "Health Check Failed": { icon: AlertTriangle, color: "text-yellow-400", bgColor: "bg-yellow-500/10" },
}

const severityConfig = {
  low: { label: "Low", variant: "secondary" as const, color: "text-blue-400" },
  medium: { label: "Medium", variant: "default" as const, color: "text-yellow-400" },
  high: { label: "High", variant: "destructive" as const, color: "text-orange-400" },
  critical: { label: "Critical", variant: "destructive" as const, color: "text-red-400" },
}

export function EventLogTable({ events, className }: EventLogTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<keyof EventLogEntry>("timestamp")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const filteredAndSortedEvents = useMemo(() => {
    const filtered = events.filter((event) => {
      const matchesSearch =
        event.targetPod.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.eventType.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesEventType = eventTypeFilter === "all" || event.eventType === eventTypeFilter
      const matchesSeverity = severityFilter === "all" || event.severity === severityFilter

      return matchesSearch && matchesEventType && matchesSeverity
    })

    filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      if (sortField === "timestamp") {
        aValue = (a.timestamp as Date).getTime()
        bValue = (b.timestamp as Date).getTime()
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      return 0
    })

    return filtered
  }, [events, searchTerm, eventTypeFilter, severityFilter, sortField, sortDirection])

  const handleSort = (field: keyof EventLogEntry) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Chaos & Incident Log
        </CardTitle>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events or pods..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Event Types</SelectItem>
              {Object.keys(eventTypeConfig).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              {Object.entries(severityConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold"
                    onClick={() => handleSort("timestamp")}
                  >
                    Timestamp
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold"
                    onClick={() => handleSort("eventType")}
                  >
                    Event Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold"
                    onClick={() => handleSort("targetPod")}
                  >
                    Target Pod
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold"
                    onClick={() => handleSort("recoveryDuration")}
                  >
                    Recovery Duration
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No events found matching your filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedEvents.map((event) => {
                  const eventConfig = eventTypeConfig[event.eventType]
                  const severityConfig_ = severityConfig[event.severity]
                  const EventIcon = eventConfig.icon

                  return (
                    <TableRow key={event.id} className="hover:bg-accent/50">
                      <TableCell className="font-mono text-sm">{event.timestamp.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <EventIcon className={cn("h-4 w-4", eventConfig.color)} />
                          <span className="font-medium">{event.eventType}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="px-2 py-1 bg-muted rounded text-sm font-mono">{event.targetPod}</code>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "font-medium",
                            event.recoveryDuration > 30
                              ? "text-red-400"
                              : event.recoveryDuration > 10
                                ? "text-yellow-400"
                                : "text-green-400",
                          )}
                        >
                          {formatDuration(event.recoveryDuration)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={severityConfig_.variant} className="text-xs">
                          {severityConfig_.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary stats */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>Total Events: {events.length}</span>
          <span>Filtered: {filteredAndSortedEvents.length}</span>
          <span>
            Avg Recovery:{" "}
            {events.length > 0
              ? formatDuration(Math.round(events.reduce((sum, e) => sum + e.recoveryDuration, 0) / events.length))
              : "N/A"}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
