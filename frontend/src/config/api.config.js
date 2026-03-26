export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// API endpoints
export const API_ENDPOINTS = {
  // Farmer endpoints
  REGISTER_FARMER: `${API_BASE}/api/farmer/register`,
  CREATE_FARMER: `${API_BASE}/create-farmer`,
  
  // Pool endpoints
  GET_POOL: (id) => `${API_BASE}/api/pool/${id}`,
  
  // Weather endpoints
  GET_WEATHER: (location) => `${API_BASE}/api/weather/${location}`,
  WEATHER: `${API_BASE}/weather`,
  
  // Admin endpoints
  ADMIN_STATS: `${API_BASE}/api/admin/stats`,
  
  // Dashboard
  DASHBOARD: `${API_BASE}/dashboard`,
  
  // Payout
  PAYOUT: `${API_BASE}/payout`,
};

// Fallback/dummy data for when backend is offline
export const DUMMY_DATA = {
  farmerDashboard: {
    poolId: "POOL-TN-001",
    premium: 2500,
    weatherStatus: "Safe",
    payoutStatus: "Pending",
    region: "Tamil Nadu",
    currentRainfall: 32,
    threshold: 50,
    payoutHistory: [
      { date: "2026-01-15", event: "Drought Alert", amount: 5000, status: "Paid" },
      { date: "2025-11-20", event: "Excess Rainfall", amount: 3500, status: "Paid" },
    ],
    poolMembers: [
      { name: "Rajesh Kumar", crop: "Rice", location: "Chennai" },
      { name: "Anita Devi", crop: "Rice", location: "Coimbatore" },
      { name: "Suresh Babu", crop: "Cotton", location: "Madurai" },
    ],
  },
  poolDashboard: {
    totalMembers: 45,
    collectivePremium: 112500,
    reserveFund: 250000,
    members: [
      { name: "Rajesh Kumar", crop: "Rice", location: "Chennai", premium: 2500, status: "Active" },
      { name: "Anita Devi", crop: "Rice", location: "Coimbatore", premium: 2500, status: "Active" },
      { name: "Suresh Babu", crop: "Cotton", location: "Madurai", premium: 3000, status: "Active" },
      { name: "Priya Sharma", crop: "Millet", location: "Salem", premium: 2000, status: "Active" },
      { name: "Mohan Raj", crop: "Sugarcane", location: "Trichy", premium: 3500, status: "Active" },
    ],
    weatherStatus: [
      { region: "Chennai", rainfall: 45, status: "Warning" },
      { region: "Coimbatore", rainfall: 28, status: "Safe" },
      { region: "Madurai", rainfall: 52, status: "Triggered" },
    ],
    claimsHistory: [
      { date: "2026-02-10", pool: "POOL-TN-001", event: "Drought", amount: 75000, status: "Disbursed" },
      { date: "2026-01-05", pool: "POOL-MH-002", event: "Flood", amount: 120000, status: "Disbursed" },
    ],
  },
  adminStats: {
    totalPools: 12,
    totalFarmers: 156,
    totalPayouts: 450000,
    agentActivity: [
      { timestamp: "2026-03-26 10:32:15", agent: "Pool Formation Agent", message: "Grouped 15 farmers into Pool #3" },
      { timestamp: "2026-03-26 10:30:42", agent: "Weather Oracle", message: "Rainfall 32mm detected in Tamil Nadu - TRIGGERED" },
      { timestamp: "2026-03-26 10:28:18", agent: "Payout Agent", message: "Rs.75,000 disbursed to 15 farmers in Pool #3" },
      { timestamp: "2026-03-26 10:25:00", agent: "Premium Agent", message: "Calculated premiums for 8 new farmers" },
      { timestamp: "2026-03-26 10:20:33", agent: "Pool Formation Agent", message: "New pool created for Odisha region" },
    ],
    monthlyData: [
      { month: "Oct", premiums: 85000, payouts: 45000 },
      { month: "Nov", premiums: 92000, payouts: 68000 },
      { month: "Dec", premiums: 78000, payouts: 52000 },
      { month: "Jan", premiums: 105000, payouts: 75000 },
      { month: "Feb", premiums: 112000, payouts: 88000 },
      { month: "Mar", premiums: 98000, payouts: 62000 },
    ],
    sustainabilityScore: 87,
  },
};

// Helper function to fetch with fallback
export async function fetchWithFallback(url, fallbackData, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`API call failed, using fallback data: ${error.message}`);
    return fallbackData;
  }
}
