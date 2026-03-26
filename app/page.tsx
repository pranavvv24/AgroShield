import { Navbar } from "@/components/navbar"
import { FarmerForm } from "@/components/farmer-form"
import { Shield } from "lucide-react"

export default function FarmerApp() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-forest-100 p-3">
            <Shield className="h-8 w-8 text-forest-500" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-foreground sm:text-4xl">
            Protect Your Crops
          </h1>
          <p className="mx-auto max-w-md text-muted-foreground">
            Register for decentralized crop insurance with weather-based risk pooling. 
            Get instant payouts when adverse weather affects your farm.
          </p>
        </div>

        {/* Registration Form */}
        <FarmerForm />

        {/* Features */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-white p-5 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-forest-100">
              <svg className="h-5 w-5 text-forest-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="mb-1 font-semibold text-foreground">Instant Payouts</h3>
            <p className="text-sm text-muted-foreground">
              Automatic payouts triggered by real-time weather data
            </p>
          </div>
          
          <div className="rounded-xl border border-border bg-white p-5 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-forest-100">
              <svg className="h-5 w-5 text-forest-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="mb-1 font-semibold text-foreground">Risk Pooling</h3>
            <p className="text-sm text-muted-foreground">
              Join farmers across regions to share and minimize risk
            </p>
          </div>
          
          <div className="rounded-xl border border-border bg-white p-5 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-forest-100">
              <svg className="h-5 w-5 text-forest-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="mb-1 font-semibold text-foreground">Transparent</h3>
            <p className="text-sm text-muted-foreground">
              All transactions and triggers are fully auditable
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
