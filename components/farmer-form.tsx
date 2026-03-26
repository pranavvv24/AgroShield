"use client"

import { useState } from "react"
import { User, MapPin, Wheat, AlertTriangle, CheckCircle, IndianRupee } from "lucide-react"

type WeatherStatus = "Safe" | "Warning" | "Triggered"

interface RegistrationResult {
  poolAssigned: string
  premiumAmount: number
  weatherStatus: WeatherStatus
  payoutSent: boolean
}

const states = ["Tamil Nadu", "Maharashtra", "Odisha"]
const cropTypes = ["Rice", "Cotton", "Millet", "Sugarcane"]
const riskLevels = ["Low", "Medium", "High"]

function getWeatherStatus(state: string, riskLevel: string): WeatherStatus {
  // Simulated logic for demo
  if (state === "Odisha" && riskLevel === "High") return "Triggered"
  if (state === "Maharashtra" && riskLevel === "Medium") return "Warning"
  if (riskLevel === "High") return "Warning"
  return "Safe"
}

function getPremiumAmount(riskLevel: string, crop: string): number {
  const basePremium = { Rice: 1500, Cotton: 2000, Millet: 1200, Sugarcane: 1800 }
  const riskMultiplier = { Low: 1, Medium: 1.5, High: 2 }
  return (basePremium[crop as keyof typeof basePremium] || 1500) * 
         (riskMultiplier[riskLevel as keyof typeof riskMultiplier] || 1)
}

function getPoolName(state: string, crop: string): string {
  return `${state.slice(0, 2).toUpperCase()}-${crop.slice(0, 3).toUpperCase()}-POOL`
}

export function FarmerForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    state: "",
    cropType: "",
    riskLevel: "",
  })
  const [result, setResult] = useState<RegistrationResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const weatherStatus = getWeatherStatus(formData.state, formData.riskLevel)
      setResult({
        poolAssigned: getPoolName(formData.state, formData.cropType),
        premiumAmount: getPremiumAmount(formData.riskLevel, formData.cropType),
        weatherStatus,
        payoutSent: weatherStatus === "Triggered",
      })
      setIsSubmitting(false)
    }, 800)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setResult(null)
  }

  const getStatusBadge = (status: WeatherStatus) => {
    const styles = {
      Safe: "bg-green-100 text-green-800 border-green-200",
      Warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Triggered: "bg-red-100 text-red-800 border-red-200",
    }
    const icons = {
      Safe: <CheckCircle className="h-4 w-4" />,
      Warning: <AlertTriangle className="h-4 w-4" />,
      Triggered: <AlertTriangle className="h-4 w-4" />,
    }
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${styles[status]}`}>
        {icons[status]}
        {status}
      </span>
    )
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-foreground">Farmer Registration</h2>
        
        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
              <User className="h-4 w-4 text-forest-500" />
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20"
            />
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
              <MapPin className="h-4 w-4 text-forest-500" />
              State
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20"
            >
              <option value="">Select your state</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* Crop Type */}
          <div>
            <label htmlFor="cropType" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
              <Wheat className="h-4 w-4 text-forest-500" />
              Crop Type
            </label>
            <select
              id="cropType"
              name="cropType"
              value={formData.cropType}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20"
            >
              <option value="">Select crop type</option>
              {cropTypes.map((crop) => (
                <option key={crop} value={crop}>
                  {crop}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Level */}
          <div>
            <label htmlFor="riskLevel" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
              <AlertTriangle className="h-4 w-4 text-forest-500" />
              Risk Level
            </label>
            <select
              id="riskLevel"
              name="riskLevel"
              value={formData.riskLevel}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20"
            >
              <option value="">Select risk level</option>
              {riskLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-lg bg-forest-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-600 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Registering..." : "Register for Insurance"}
          </button>
        </div>
      </form>

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-4">
          {/* Payout Banner */}
          {result.payoutSent && (
            <div className="flex items-center gap-3 rounded-xl bg-green-500 px-5 py-4 text-white shadow-lg">
              <CheckCircle className="h-6 w-6 flex-shrink-0" />
              <div>
                <p className="font-semibold">Payout Sent!</p>
                <p className="text-sm text-green-100">You have received a payout of ₹5,000</p>
              </div>
            </div>
          )}

          {/* Result Card */}
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Registration Complete</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                <span className="text-sm text-muted-foreground">Pool Assigned</span>
                <span className="font-mono font-semibold text-forest-500">{result.poolAssigned}</span>
              </div>
              
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                <span className="text-sm text-muted-foreground">Premium Amount</span>
                <span className="flex items-center gap-1 font-semibold text-foreground">
                  <IndianRupee className="h-4 w-4" />
                  {result.premiumAmount.toLocaleString("en-IN")}
                </span>
              </div>
              
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                <span className="text-sm text-muted-foreground">Weather Status</span>
                {getStatusBadge(result.weatherStatus)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
