import { Navbar } from "@/components/navbar"
import { Users, IndianRupee, Cloud, AlertTriangle, CheckCircle, History } from "lucide-react"

// Hardcoded member data
const members = [
  { id: 1, name: "Rajesh Kumar", crop: "Rice", location: "Tamil Nadu", premiumPaid: 1500 },
  { id: 2, name: "Priya Sharma", crop: "Cotton", location: "Maharashtra", premiumPaid: 3000 },
  { id: 3, name: "Suresh Patel", crop: "Sugarcane", location: "Maharashtra", premiumPaid: 2700 },
  { id: 4, name: "Anita Devi", crop: "Millet", location: "Odisha", premiumPaid: 2400 },
  { id: 5, name: "Mohan Singh", crop: "Rice", location: "Tamil Nadu", premiumPaid: 2250 },
  { id: 6, name: "Lakshmi Rao", crop: "Cotton", location: "Odisha", premiumPaid: 4000 },
  { id: 7, name: "Venkat Reddy", crop: "Sugarcane", location: "Tamil Nadu", premiumPaid: 1800 },
  { id: 8, name: "Geeta Kumari", crop: "Millet", location: "Maharashtra", premiumPaid: 1200 },
]

// Weather status per region
const weatherByRegion = [
  { region: "Tamil Nadu", status: "Safe" as const, description: "Normal rainfall expected" },
  { region: "Maharashtra", status: "Warning" as const, description: "Below average rainfall" },
  { region: "Odisha", status: "Triggered" as const, description: "Severe drought conditions" },
]

// Claims history
const claimsHistory = [
  { id: 1, date: "2024-03-15", farmer: "Anita Devi", amount: 5000, reason: "Drought" },
  { id: 2, date: "2024-03-10", farmer: "Lakshmi Rao", amount: 5000, reason: "Flood" },
  { id: 3, date: "2024-02-28", farmer: "Suresh Patel", amount: 3500, reason: "Pest Outbreak" },
  { id: 4, date: "2024-02-15", farmer: "Mohan Singh", amount: 4200, reason: "Cyclone" },
  { id: 5, date: "2024-01-20", farmer: "Geeta Kumari", amount: 2800, reason: "Hailstorm" },
]

function getStatusBadge(status: "Safe" | "Warning" | "Triggered") {
  const styles = {
    Safe: "bg-green-100 text-green-800",
    Warning: "bg-yellow-100 text-yellow-800",
    Triggered: "bg-red-100 text-red-800",
  }
  const icons = {
    Safe: <CheckCircle className="h-4 w-4" />,
    Warning: <AlertTriangle className="h-4 w-4" />,
    Triggered: <AlertTriangle className="h-4 w-4" />,
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
      {icons[status]}
      {status}
    </span>
  )
}

export default function PoolDashboard() {
  const totalPremium = members.reduce((sum, m) => sum + m.premiumPaid, 0)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Pool Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            View pool members, weather conditions, and claims history
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Premium */}
          <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-100">
                <IndianRupee className="h-5 w-5 text-forest-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Premium Collected</p>
                <p className="text-2xl font-bold text-foreground">
                  ₹{totalPremium.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          {/* Total Members */}
          <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-100">
                <Users className="h-5 w-5 text-forest-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pool Members</p>
                <p className="text-2xl font-bold text-foreground">{members.length}</p>
              </div>
            </div>
          </div>

          {/* Active Regions */}
          <div className="rounded-xl border border-border bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-100">
                <Cloud className="h-5 w-5 text-forest-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Regions</p>
                <p className="text-2xl font-bold text-foreground">{weatherByRegion.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Status Grid */}
        <div className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            <Cloud className="h-5 w-5 text-forest-500" />
            Weather Status by Region
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {weatherByRegion.map((region) => (
              <div
                key={region.region}
                className="rounded-xl border border-border bg-white p-5 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{region.region}</h3>
                  {getStatusBadge(region.status)}
                </div>
                <p className="text-sm text-muted-foreground">{region.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Member Table */}
        <div className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            <Users className="h-5 w-5 text-forest-500" />
            Pool Members
          </h2>
          <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Crop</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Location</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Premium Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member, index) => (
                    <tr
                      key={member.id}
                      className={index !== members.length - 1 ? "border-b border-border" : ""}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{member.name}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{member.crop}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{member.location}</td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-foreground">
                        ₹{member.premiumPaid.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Claims History */}
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            <History className="h-5 w-5 text-forest-500" />
            Claims History
          </h2>
          <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Farmer</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Reason</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {claimsHistory.map((claim, index) => (
                    <tr
                      key={claim.id}
                      className={index !== claimsHistory.length - 1 ? "border-b border-border" : ""}
                    >
                      <td className="px-4 py-3 text-sm text-muted-foreground">{claim.date}</td>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{claim.farmer}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{claim.reason}</td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-green-600">
                        ₹{claim.amount.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
