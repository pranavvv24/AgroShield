import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  ShieldCheck, Users, Layers, IndianRupee, Activity, 
  BarChart3, Gauge, Home, LayoutDashboard, Settings,
  Bot, CloudRain, CreditCard, Calculator
} from 'lucide-react';
import { DUMMY_DATA, fetchWithFallback, API_ENDPOINTS } from '../config/api.config';

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const adminData = await fetchWithFallback(
        API_ENDPOINTS.ADMIN_STATS,
        DUMMY_DATA.adminStats
      );
      setData(adminData);
    } catch {
      setData(DUMMY_DATA.adminStats);
    }
    setLoading(false);
  };

  const navItems = [
    { icon: Home, label: 'Landing', path: '/' },
    { icon: LayoutDashboard, label: 'Farmer Dashboard', path: '/farmer-dashboard' },
    { icon: Users, label: 'Pool Dashboard', path: '/pool-dashboard' },
    { icon: Settings, label: 'Admin', path: '/admin', active: true },
  ];

  const getAgentIcon = (agent) => {
    if (agent.includes('Pool')) return Layers;
    if (agent.includes('Weather')) return CloudRain;
    if (agent.includes('Payout')) return CreditCard;
    if (agent.includes('Premium')) return Calculator;
    return Bot;
  };

  const getAgentColor = (agent) => {
    if (agent.includes('Pool')) return '#10b981';
    if (agent.includes('Weather')) return '#3b82f6';
    if (agent.includes('Payout')) return '#ef4444';
    if (agent.includes('Premium')) return '#f59e0b';
    return '#8b5cf6';
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex' }}>
        <AdminSidebar navItems={navItems} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} location={location} />
        <main style={{ flex: 1, marginLeft: sidebarOpen ? '260px' : '80px', transition: 'margin-left 0.3s' }}>
          <LoadingSpinner text="Loading admin data..." />
        </main>
      </div>
    );
  }

  // Calculate max value for chart scaling
  const maxValue = Math.max(
    ...data.monthlyData.map(d => Math.max(d.premiums, d.payouts))
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex' }}>
      {/* Sidebar */}
      <AdminSidebar navItems={navItems} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} location={location} />

      {/* Main Content */}
      <main style={{ 
        flex: 1, 
        marginLeft: sidebarOpen ? '260px' : '80px', 
        transition: 'margin-left 0.3s',
        padding: '2rem',
        background: '#0f172a'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
            Admin Dashboard
          </h1>
          <p style={{ color: '#94a3b8' }}>
            System overview and agent monitoring
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <AdminStatCard
            icon={Layers}
            label="Total Pools"
            value={data?.totalPools || 12}
            iconColor="#10b981"
          />
          <AdminStatCard
            icon={Users}
            label="Total Farmers"
            value={data?.totalFarmers || 156}
            iconColor="#3b82f6"
          />
          <AdminStatCard
            icon={IndianRupee}
            label="Total Payouts"
            value={`Rs.${(data?.totalPayouts || 450000).toLocaleString()}`}
            iconColor="#f59e0b"
          />
        </div>

        {/* Agent Activity & Chart Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Agent Activity Log */}
          <div style={{
            background: '#1e293b',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid #334155'
          }}>
            <h2 style={{ 
              fontSize: '1.125rem', 
              fontWeight: 600, 
              color: 'white',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Activity size={20} style={{ color: '#10b981' }} />
              Agent Activity Log
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto' }}>
              {(data?.agentActivity || []).map((activity, idx) => {
                const AgentIcon = getAgentIcon(activity.agent);
                const agentColor = getAgentColor(activity.agent);
                return (
                  <div 
                    key={idx} 
                    style={{
                      padding: '1rem',
                      background: '#0f172a',
                      borderRadius: '12px',
                      borderLeft: `3px solid ${agentColor}`
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: `${agentColor}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <AgentIcon size={16} style={{ color: agentColor }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                          <span style={{ color: agentColor, fontSize: '0.8rem', fontWeight: 600 }}>
                            {activity.agent}
                          </span>
                          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>
                            {activity.timestamp.split(' ')[1]}
                          </span>
                        </div>
                        <p style={{ color: '#e2e8f0', fontSize: '0.9rem', margin: 0 }}>
                          {activity.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bar Chart */}
          <div style={{
            background: '#1e293b',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid #334155'
          }}>
            <h2 style={{ 
              fontSize: '1.125rem', 
              fontWeight: 600, 
              color: 'white',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <BarChart3 size={20} style={{ color: '#3b82f6' }} />
              Premium vs Payouts (Last 6 Months)
            </h2>
            
            {/* Legend */}
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#10b981' }} />
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Premiums Collected</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#ef4444' }} />
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Payouts Sent</span>
              </div>
            </div>

            {/* Chart */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-end', 
              gap: '1rem',
              height: '250px',
              padding: '1rem 0'
            }}>
              {(data?.monthlyData || []).map((month, idx) => (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    gap: '4px', 
                    alignItems: 'flex-end',
                    height: '200px'
                  }}>
                    {/* Premium Bar */}
                    <div style={{
                      width: '20px',
                      height: `${(month.premiums / maxValue) * 180}px`,
                      background: 'linear-gradient(180deg, #10b981, #059669)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.5s ease'
                    }} />
                    {/* Payout Bar */}
                    <div style={{
                      width: '20px',
                      height: `${(month.payouts / maxValue) * 180}px`,
                      background: 'linear-gradient(180deg, #ef4444, #dc2626)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.5s ease'
                    }} />
                  </div>
                  <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{month.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sustainability Score */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: '16px',
          padding: '2rem',
          border: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem'
        }}>
          <div>
            <h2 style={{ 
              fontSize: '1.125rem', 
              fontWeight: 600, 
              color: 'white',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Gauge size={20} style={{ color: '#10b981' }} />
              Sustainability Score
            </h2>
            <p style={{ color: '#94a3b8', maxWidth: '400px' }}>
              Measures the health of the insurance pool based on premium-to-payout ratio and reserve fund adequacy.
            </p>
          </div>
          
          {/* Circular Progress */}
          <div style={{ position: 'relative', width: '120px', height: '120px' }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#334155"
                strokeWidth="10"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#10b981"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${(data?.sustainabilityScore || 87) * 3.14} 314`}
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dasharray 1s ease' }}
              />
            </svg>
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '2rem', fontWeight: 700, color: 'white' }}>
                {data?.sustainabilityScore || 87}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>/ 100</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function AdminSidebar({ navItems, sidebarOpen, setSidebarOpen, location }) {
  return (
    <aside style={{
      width: sidebarOpen ? '260px' : '80px',
      background: '#1e293b',
      borderRight: '1px solid #334155',
      position: 'fixed',
      height: '100vh',
      transition: 'width 0.3s',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50
    }}>
      {/* Logo */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid #334155',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <ShieldCheck size={28} style={{ color: '#10b981', flexShrink: 0 }} />
        {sidebarOpen && (
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>
            AgroShield
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem' }}>
        {navItems.map((item, idx) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={idx}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.875rem 1rem',
                marginBottom: '0.5rem',
                borderRadius: '10px',
                textDecoration: 'none',
                color: isActive ? 'white' : '#94a3b8',
                background: isActive ? '#334155' : 'transparent',
                transition: 'all 0.2s'
              }}
            >
              <item.icon size={20} style={{ flexShrink: 0 }} />
              {sidebarOpen && <span style={{ fontWeight: isActive ? 600 : 400 }}>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          padding: '1rem',
          borderTop: '1px solid #334155',
          background: 'none',
          border: 'none',
          color: '#94a3b8',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarOpen ? 'flex-end' : 'center'
        }}
      >
        <span style={{ transform: sidebarOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>
          {'>'}
        </span>
      </button>
    </aside>
  );
}

function AdminStatCard({ icon: Icon, label, value, iconColor }) {
  return (
    <div style={{
      background: '#1e293b',
      borderRadius: '16px',
      padding: '1.5rem',
      border: '1px solid #334155'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{label}</span>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: `${iconColor}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={20} style={{ color: iconColor }} />
        </div>
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white' }}>
        {value}
      </div>
    </div>
  );
}
