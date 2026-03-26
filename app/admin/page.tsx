"use client"

import { Navbar } from "@/components/navbar"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Legend
} from "recharts"
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart"
import { 
  Users, 
  Layers, 
  Wallet, 
  Activity, 
  Bot, 
  Clock 
} from "lucide-react"

// Hardcoded stats
const stats = {
  totalPools: 12,
  totalMembers: 847,
  reserveFund: 2450000,
}

// Agent activity log
const agentActivity = [
  { id: 1, timestamp: "2024-03-20 14:32:05", agent: "WeatherAgent", action: "Fetched weather data for Tamil Nadu - Normal conditions" },
  { id: 2, timestamp: "2024-03-20 14:31:45", agent: "PoolAgent", action: "Added new member Rajesh Kumar to TN-RIC-POOL" },
  { id: 3, timestamp: "2024-03-20 14:30:22", agent: "PayoutAgent", action: "Processed payout of ₹5,000 to Anita Devi" },
  { id: 4, timestamp: "2024-03-20 14:28:10", agent: "PremiumAgent", action: "Calculated premium ₹2,400 for High-risk Millet" },
  { id: 5, timestamp: "2024-03-20 14:25:55", agent: "WeatherAgent", action: "ALERT: Drought triggered in Odisha region" },
  { id: 6, timestamp: "2024-03-20 14:22:33", agent: "PoolAgent", action: "Created new pool OD-MIL-POOL for Odisha Millet farmers" },
  { id: 7, timestamp: "2024-03-20 14:18:45", agent: "PayoutAgent", action: "Processed payout of ₹5,000 to Lakshmi Rao" },
  { id: 8, timestamp: "2024-03-20 14:15:20", agent: "WeatherAgent", action: "Warning: Below average rainfall in Maharashtra" },
]

// Chart data - Premium vs Payouts
const chartData = [
  { month: "Jan", premium: 125000, payouts: 45000 },
  { month: "Feb", premium: 185000, payouts: 62000 },
  { month: "Mar", premium: 220000, payouts: 180000 },
  { month: "Apr", premium: 165000, payouts: 35000 },
  { month: "May", premium: 198000, payouts: 88000 },
  { month: "Jun", premium: 245000, payouts: 125000 },
]

const chartConfig = {
  premium: {
    label: "Premium Collected",
    color: "#2C5F2D",
  },
  payouts: {
    label: "Payouts Sent",
    color: "#66BB6A",
  },
}

function getAgentIcon(agent: string) {
  const icons: Record<string, React.ReactNode> = {
    WeatherAgent: <span className="text-blue-500">W</span>,
    PoolAgent: <span className="text-green-500">P</span>,
    PayoutAgent: <span className="text-yellow-500">$</span>,
    PremiumAgent: <span className="text-purple-500">₹</span>,
  }
  return icons[agent] || "?"
}

function getAgentBadgeStyle(agent: string) {
  const styles: Record<string, string> = {
    WeatherAgent: "bg-blue-100 text-blue-800",
    PoolAgent: "bg-green-100 text-green-800",
    PayoutAgent: "bg-yellow-100 text-yellow-800",
    PremiumAgent: "bg-purple-100 text-purple-800",
  }
  return styles[agent] || "bg-gray-100 text-gray-800"
}

export default function AdminView() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Admin Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            System overview, agent activity, and financial metrics
          </p>
        </div>

        {/* Stat Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-100">
                <Layers className="h-6 w-6 text-forest-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pools</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalPools}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-100">
                <Users className="h-6 w-6 text-forest-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalMembers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-100">
                <Wallet className="h-6 w-6 text-forest-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reserve Fund</p>
                <p className="text-3xl font-bold text-foreground">
                  ₹{(stats.reserveFund / 100000).toFixed(1)}L
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Bar Chart */}
          <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-forest-500" />
              <h2 className="text-lg font-semibold text-foreground">Premium vs Payouts</h2>
            </div>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                    tick={{ fontSize: 12 }}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />} 
                    cursor={{ fill: "rgba(44, 95, 45, 0.05)" }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="premium" 
                    fill="#2C5F2D" 
                    radius={[4, 4, 0, 0]} 
                    name="Premium Collected"
                  />
                  <Bar 
                    dataKey="payouts" 
                    fill="#66BB6A" 
                    radius={[4, 4, 0, 0]} 
                    name="Payouts Sent"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Agent Activity Log */}
          <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Bot className="h-5 w-5 text-forest-500" />
              <h2 className="text-lg font-semibold text-foreground">Agent Activity Log</h2>
            </div>
            <div className="max-h-[340px] space-y-3 overflow-y-auto pr-2">
              {agentActivity.map((activity) => (
                <div 
                  key={activity.id} 
                  className="rounded-lg border border-border bg-muted/30 p-3"
                >
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${getAgentBadgeStyle(activity.agent)}`}>
                      {getAgentIcon(activity.agent)}
                      {activity.agent}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {activity.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{activity.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-white p-4 text-center">
            <p className="text-2xl font-bold text-forest-500">₹11.38L</p>
            <p className="text-sm text-muted-foreground">Total Premium (6 mo)</p>
          </div>
          <div className="rounded-lg border border-border bg-white p-4 text-center">
            <p className="text-2xl font-bold text-green-500">₹5.35L</p>
            <p className="text-sm text-muted-foreground">Total Payouts (6 mo)</p>
          </div>
          <div className="rounded-lg border border-border bg-white p-4 text-center">
            <p className="text-2xl font-bold text-foreground">47%</p>
            <p className="text-sm text-muted-foreground">Loss Ratio</p>
          </div>
          <div className="rounded-lg border border-border bg-white p-4 text-center">
            <p className="text-2xl font-bold text-foreground">24</p>
            <p className="text-sm text-muted-foreground">Claims Processed</p>
          </div>
        </div>
      </main>
    </div>
  )
}
