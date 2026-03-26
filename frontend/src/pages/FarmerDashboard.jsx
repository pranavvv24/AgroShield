import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { ShieldCheck, IndianRupee, CloudRain, CreditCard, Droplets, Users, MapPin, Sprout } from 'lucide-react';
import { DUMMY_DATA, fetchWithFallback, API_ENDPOINTS } from '../config/api';

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [farmerData, setFarmerData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    
    // Get stored farmer data
    const storedFarmer = localStorage.getItem('farmerData');
    let farmer = storedFarmer ? JSON.parse(storedFarmer) : null;
    
    // If no farmer data, use dummy data
    if (!farmer) {
      farmer = {
        name: 'Demo Farmer',
        location: 'Chennai, Tamil Nadu',
        crop: 'Rice',
        poolId: DUMMY_DATA.farmerDashboard.poolId,
        premium: DUMMY_DATA.farmerDashboard.premium
      };
    }
    
    setFarmerData(farmer);

    // Try to fetch live data, fallback to dummy
    try {
      const data = await fetchWithFallback(
        API_ENDPOINTS.DASHBOARD,
        DUMMY_DATA.farmerDashboard
      );
      setDashboardData({ ...DUMMY_DATA.farmerDashboard, ...data });
    } catch {
      setDashboardData(DUMMY_DATA.farmerDashboard);
    }
    
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'safe': return { bg: '#dcfce7', text: '#166534' };
      case 'warning': return { bg: '#fef3c7', text: '#92400e' };
      case 'triggered': return { bg: '#fee2e2', text: '#991b1b' };
      default: return { bg: '#f1f5f9', text: '#475569' };
    }
  };

  const getRainfallProgress = () => {
    const current = dashboardData?.currentRainfall || 32;
    const threshold = dashboardData?.threshold || 50;
    return Math.min((current / threshold) * 100, 100);
  };

  const getProgressColor = () => {
    const progress = getRainfallProgress();
    if (progress >= 100) return '#ef4444';
    if (progress >= 70) return '#f59e0b';
    return '#22c55e';
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
        <Navbar farmerName={farmerData?.name} showLogout />
        <LoadingSpinner text="Loading your dashboard..." />
      </div>
    );
  }

  const weatherStatus = dashboardData?.weatherStatus || 'Safe';
  const statusColors = getStatusColor(weatherStatus);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
      <Navbar farmerName={farmerData?.name} showLogout />
      
      <main className="container" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Welcome Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Welcome back, {farmerData?.name?.split(' ')[0] || 'Farmer'}
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {farmerData?.location || 'Your farm location'} | {farmerData?.crop || 'Crop'} Farm
          </p>
        </div>

        {/* Stat Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <StatCard
            icon={ShieldCheck}
            label="Pool ID"
            value={farmerData?.poolId || dashboardData?.poolId || 'POOL-TN-001'}
            iconColor="#10b981"
          />
          <StatCard
            icon={IndianRupee}
            label="Premium Amount"
            value={`Rs.${(farmerData?.premium || dashboardData?.premium || 2500).toLocaleString()}`}
            iconColor="#f59e0b"
          />
          <StatCard
            icon={CloudRain}
            label="Weather Status"
            value={weatherStatus}
            valueStyle={{ 
              background: statusColors.bg, 
              color: statusColors.text,
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.9rem',
              fontWeight: 600
            }}
            iconColor="#3b82f6"
          />
          <StatCard
            icon={CreditCard}
            label="Payout Status"
            value={dashboardData?.payoutStatus || 'Pending'}
            iconColor="#8b5cf6"
          />
        </div>

        {/* Weather Monitoring Card */}
        <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Droplets size={22} style={{ color: '#3b82f6' }} />
            Weather Monitoring
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Region</p>
              <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{dashboardData?.region || 'Tamil Nadu'}</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Current Rainfall</p>
              <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{dashboardData?.currentRainfall || 32} mm</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Threshold</p>
              <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{dashboardData?.threshold || 50} mm</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Rainfall Level</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{Math.round(getRainfallProgress())}%</span>
            </div>
            <div style={{
              height: '12px',
              background: '#e2e8f0',
              borderRadius: '6px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${getRainfallProgress()}%`,
                background: getProgressColor(),
                borderRadius: '6px',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>

          {/* Status Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Status:</span>
            <span style={{
              background: statusColors.bg,
              color: statusColors.text,
              padding: '0.375rem 1rem',
              borderRadius: '9999px',
              fontWeight: 600,
              fontSize: '0.875rem'
            }}>
              {weatherStatus}
            </span>
          </div>
        </div>

        {/* Payout History & Pool Members Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Payout History */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.25rem' }}>
              Payout History
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Date</th>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Trigger Event</th>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Amount</th>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(dashboardData?.payoutHistory || []).map((payout, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.875rem 0.5rem', fontSize: '0.9rem' }}>{payout.date}</td>
                      <td style={{ padding: '0.875rem 0.5rem', fontSize: '0.9rem' }}>{payout.event}</td>
                      <td style={{ padding: '0.875rem 0.5rem', fontSize: '0.9rem', textAlign: 'right', fontWeight: 500 }}>Rs.{payout.amount.toLocaleString()}</td>
                      <td style={{ padding: '0.875rem 0.5rem', textAlign: 'center' }}>
                        <span className={`badge badge-${payout.status === 'Paid' ? 'success' : 'neutral'}`}>
                          {payout.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {(!dashboardData?.payoutHistory || dashboardData.payoutHistory.length === 0) && (
                    <tr>
                      <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No payout history yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pool Members */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} style={{ color: 'var(--primary)' }} />
              My Pool Members
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(dashboardData?.poolMembers || []).map((member, idx) => (
                <div 
                  key={idx} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    background: 'var(--bg-color)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    color: '#166534'
                  }}>
                    {member.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{member.name}</p>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Sprout size={14} /> {member.crop}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={14} /> {member.location}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {(!dashboardData?.poolMembers || dashboardData.poolMembers.length === 0) && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  No pool members yet
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, iconColor, valueStyle = {} }) {
  return (
    <div className="card animate-fade-in" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{label}</span>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: `${iconColor}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={18} style={{ color: iconColor }} />
        </div>
      </div>
      <div style={{ 
        fontSize: '1.5rem', 
        fontWeight: 700,
        ...valueStyle
      }}>
        {value}
      </div>
    </div>
  );
}
