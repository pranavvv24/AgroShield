import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { Users, IndianRupee, PiggyBank, CloudRain, MapPin, Sprout, Calendar } from 'lucide-react';
import { DUMMY_DATA, fetchWithFallback, API_ENDPOINTS } from '../config/api.config';

export default function PoolDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    loadPoolData();
  }, []);

  const loadPoolData = async () => {
    setLoading(true);
    try {
      const poolData = await fetchWithFallback(
        API_ENDPOINTS.GET_POOL('POOL-TN-001'),
        DUMMY_DATA.poolDashboard
      );
      setData(poolData);
    } catch {
      setData(DUMMY_DATA.poolDashboard);
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'safe': return { bg: '#dcfce7', text: '#166534' };
      case 'warning': return { bg: '#fef3c7', text: '#92400e' };
      case 'triggered': return { bg: '#fee2e2', text: '#991b1b' };
      case 'active': return { bg: '#dbeafe', text: '#1e40af' };
      case 'disbursed': return { bg: '#dcfce7', text: '#166534' };
      default: return { bg: '#f1f5f9', text: '#475569' };
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
        <Navbar />
        <LoadingSpinner text="Loading pool data..." />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
      <Navbar />
      
      <main className="container" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Pool Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Overview of pool performance and member statistics
          </p>
        </div>

        {/* Pool Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <StatCard
            icon={Users}
            label="Total Members"
            value={data?.totalMembers || 45}
            iconColor="#10b981"
          />
          <StatCard
            icon={IndianRupee}
            label="Collective Premium"
            value={`Rs.${(data?.collectivePremium || 112500).toLocaleString()}`}
            iconColor="#f59e0b"
          />
          <StatCard
            icon={PiggyBank}
            label="Reserve Fund"
            value={`Rs.${(data?.reserveFund || 250000).toLocaleString()}`}
            iconColor="#8b5cf6"
          />
        </div>

        {/* Members Table */}
        <div className="card" style={{ marginBottom: '2rem', padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem 1.5rem 1rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Pool Members</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-color)', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Name</th>
                  <th style={{ padding: '1rem 1rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Crop</th>
                  <th style={{ padding: '1rem 1rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Location</th>
                  <th style={{ padding: '1rem 1rem', textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Premium</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {(data?.members || []).map((member, idx) => {
                  const statusColors = getStatusColor(member.status);
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 600,
                            color: '#166534',
                            fontSize: '0.9rem'
                          }}>
                            {member.name.charAt(0)}
                          </div>
                          <span style={{ fontWeight: 500 }}>{member.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                          <Sprout size={16} /> {member.crop}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                          <MapPin size={16} /> {member.location}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1rem', textAlign: 'right', fontWeight: 500 }}>
                        Rs.{member.premium.toLocaleString()}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                        <span style={{
                          background: statusColors.bg,
                          color: statusColors.text,
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}>
                          {member.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Weather Status & Claims Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Weather Status Cards */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CloudRain size={20} style={{ color: '#3b82f6' }} />
              Weather Status by Region
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(data?.weatherStatus || []).map((region, idx) => {
                const statusColors = getStatusColor(region.status);
                const progress = Math.min((region.rainfall / 50) * 100, 100);
                return (
                  <div 
                    key={idx} 
                    style={{
                      padding: '1rem',
                      background: 'var(--bg-color)',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 500 }}>{region.region}</span>
                      <span style={{
                        background: statusColors.bg,
                        color: statusColors.text,
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        {region.status}
                      </span>
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        <span>Rainfall</span>
                        <span>{region.rainfall} mm / 50 mm</span>
                      </div>
                      <div style={{
                        height: '8px',
                        background: '#e2e8f0',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${progress}%`,
                          background: statusColors.text,
                          borderRadius: '4px',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Claims History */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} style={{ color: '#8b5cf6' }} />
              Claims History
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(data?.claimsHistory || []).map((claim, idx) => {
                const statusColors = getStatusColor(claim.status);
                return (
                  <div 
                    key={idx} 
                    style={{
                      padding: '1rem',
                      background: 'var(--bg-color)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.75rem'
                    }}
                  >
                    <div>
                      <p style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{claim.pool}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {claim.date} - {claim.event}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Rs.{claim.amount.toLocaleString()}</p>
                      <span style={{
                        background: statusColors.bg,
                        color: statusColors.text,
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        {claim.status}
                      </span>
                    </div>
                  </div>
                );
              })}
              {(!data?.claimsHistory || data.claimsHistory.length === 0) && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  No claims history yet
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, iconColor }) {
  return (
    <div className="card animate-fade-in" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{label}</span>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: `${iconColor}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={20} style={{ color: iconColor }} />
        </div>
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>
        {value}
      </div>
    </div>
  );
}
