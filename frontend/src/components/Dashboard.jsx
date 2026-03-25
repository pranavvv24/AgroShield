import { useState, useEffect } from 'react';
import { Users, Droplets, CloudRain, ShieldCheck, DollarSign } from 'lucide-react';

export default function Dashboard({ refreshTrigger }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [refreshTrigger]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/dashboard');
      if (!res.ok) throw new Error('Failed to fetch dashboard data');
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateWeather = async () => {
    try {
      if (!data?.farmers?.length) return alert('No farmers to simulate weather for.');
      const firstFarmer = data.farmers[0];
      const res = await fetch(`/weather?lat=${firstFarmer.latitude}&lon=${firstFarmer.longitude}`);
      const d = await res.json();
      if (!res.ok) throw new Error(d?.error || 'Weather request failed');
      alert(`Weather simulation complete!\n\nTriggered: ${d.weather.triggered}\nRainfall: ${d.weather.rainfall_mm}mm\nTemperature: ${d.weather.temperature_c}°C`);
      fetchDashboardData();
    } catch (err) {
      alert('Failed to update weather: ' + err.message);
    }
  };

  const handleProcessPayouts = async () => {
    try {
      if (!data?.farmers?.length) return alert('No farmers to process payouts for.');
      
      let processed = 0;
      for (const farmer of data.farmers) {
        const res = await fetch('/payout', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ farmer_id: farmer.id })
        });
        const d = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(d?.error || 'Payout request failed');
        processed++;
      }
      alert(`Payout processing complete for ${processed} farmers!`);
      fetchDashboardData();
    } catch (err) {
      alert('Failed to process payouts: ' + err.message);
    }
  };

  if (loading && !data) return <div className="card text-center"><div className="text-muted">Loading dashboard...</div></div>;
  if (error && !data) return <div className="card text-danger">Error: {error}</div>;
  if (!data) return null;

  const totalFarmers = data?.total_farmers || 0;
  const totalPools = data?.pools?.length || 0;
  const totalPremium = data?.total_premium || 0;
  const totalPayout = data?.total_payout || 0;

  return (
    <div className="flex-col gap-4">
      <div className="grid-dashboard mb-6">
        <div className="card animate-fade-in">
          <div className="card-header">
            <h3 className="card-subtitle text-muted flex-between" style={{ width: '100%' }}>
              Total Farmers <Users size={20} className="text-primary" />
            </h3>
          </div>
          <div className="card-value">{totalFarmers}</div>
        </div>

        <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="card-header">
            <h3 className="card-subtitle text-muted flex-between" style={{ width: '100%' }}>
              Active Risk Pools <ShieldCheck size={20} className="text-success" />
            </h3>
          </div>
          <div className="card-value">{totalPools}</div>
        </div>

        <div className="card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="card-header">
            <h3 className="card-subtitle text-muted flex-between" style={{ width: '100%' }}>
              Total Premium Pool <DollarSign size={20} className="text-warning" />
            </h3>
          </div>
          <div className="card-value">${totalPremium.toFixed(2)}</div>
        </div>

        <div className="card animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="card-header">
            <h3 className="card-subtitle text-muted flex-between" style={{ width: '100%' }}>
              Total Payouts <Droplets size={20} className="text-danger" />
            </h3>
          </div>
          <div className="card-value">${totalPayout.toFixed(2)}</div>
        </div>
      </div>
      <div className="flex-between mb-4 mt-8">
        <h2 className="card-title" style={{ fontSize: '1.25rem' }}>Detailed Insights</h2>
        <div className="flex-between gap-2">
          <button onClick={handleSimulateWeather} className="btn" style={{ background: 'white', border: '1px solid var(--border)', color: 'var(--text-main)', boxShadow: 'var(--shadow-sm)' }}>
            <CloudRain size={18} className="text-primary" /> Update Oracle
          </button>
          <button onClick={handleProcessPayouts} className="btn" style={{ backgroundColor: 'var(--danger)', color: 'white', border: 'none', boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)' }}>
            <DollarSign size={18} /> Trigger Payouts
          </button>
        </div>
      </div>
      <div className="card animate-fade-in" style={{ gridColumn: '1 / -1', padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem 1.5rem 0.5rem' }}>
           <h3 className="card-title">Registered Farmers</h3>
        </div>
        <div style={{ overflowX: 'auto', padding: '0 1.5rem 1.5rem' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '1rem', whiteSpace: 'nowrap' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem 0.75rem', fontWeight: 600, fontSize: '0.875rem' }}>Name</th>
                <th style={{ padding: '1rem 0.75rem', fontWeight: 600, fontSize: '0.875rem' }}>Location</th>
                <th style={{ padding: '1rem 0.75rem', fontWeight: 600, fontSize: '0.875rem' }}>Crop</th>
                <th style={{ padding: '1rem 0.75rem', fontWeight: 600, fontSize: '0.875rem' }}>Rainfall</th>
                <th style={{ padding: '1rem 0.75rem', fontWeight: 600, fontSize: '0.875rem' }}>Trigger Status</th>
                <th style={{ padding: '1rem 0.75rem', fontWeight: 600, fontSize: '0.875rem' }}>Pool ID</th>
                <th style={{ padding: '1rem 0.75rem', fontWeight: 600, fontSize: '0.875rem' }}>Premium</th>
                <th style={{ padding: '1rem 0.75rem', fontWeight: 600, fontSize: '0.875rem' }}>Payout</th>
                <th style={{ padding: '1rem 0.75rem', fontWeight: 600, fontSize: '0.875rem' }}>Status</th>
                <th style={{ padding: '1rem 0.75rem', fontWeight: 600, fontSize: '0.875rem' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {data.farmers && data.farmers.length > 0 ? data.farmers.map((farmer, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.2s', backgroundColor: farmer.weather?.triggered ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = farmer.weather?.triggered ? 'rgba(239, 68, 68, 0.1)' : '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = farmer.weather?.triggered ? 'rgba(239, 68, 68, 0.05)' : 'transparent'}>
                  <td style={{ padding: '1rem 0.75rem', fontWeight: '500', color: 'var(--text-main)' }}>{farmer.name}</td>
                  <td style={{ padding: '1rem 0.75rem', color: 'var(--text-muted)' }}>{farmer.location}</td>
                  <td style={{ padding: '1rem 0.75rem' }}>{farmer.crop}</td>
                  <td style={{ padding: '1rem 0.75rem' }}>
                    {farmer.weather?.rainfall_mm !== undefined ? `${farmer.weather.rainfall_mm} mm` : 'N/A'}
                  </td>
                  <td style={{ padding: '1rem 0.75rem' }}>
                    <span className={`badge badge-${farmer.weather?.triggered ? 'danger' : 'success'}`}>
                      {farmer.weather?.triggered ? 'Triggered' : 'Not Triggered'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.75rem', fontFamily: 'monospace', fontSize: '0.875rem' }}>{farmer.pool_id || 'Pending'}</td>
                  <td style={{ padding: '1rem 0.75rem', fontWeight: '500' }}>{Number(farmer.premium || 0).toFixed(2)}</td>
                  <td style={{ padding: '1rem 0.75rem' }}>
                    {(Number(farmer.payout || 0) > 0) ? (
                      <span className="badge badge-success">5000</span>
                    ) : (
                      <span className="badge badge-neutral">0</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem 0.75rem' }}>
                    <span className={`badge badge-${farmer.status === 'Paid' ? 'success' : (farmer.status === 'No Payout' ? 'neutral' : 'primary')}`}>
                      {farmer.status || 'active'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.75rem', maxWidth: '360px' }}>
                    <details>
                      <summary style={{ cursor: 'pointer', color: 'var(--primary)' }}>View</summary>
                      <pre style={{ marginTop: '0.75rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {JSON.stringify(farmer, null, 2)}
                      </pre>
                    </details>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="10" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No farmers registered yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <h2 className="card-title mb-4 mt-8">Active Risk Pools</h2>
      <div className="grid-dashboard mb-8">
        {data.pools && data.pools.length > 0 ? data.pools.map((pool, idx) => (
          <div key={`pool-${idx}`} className="card animate-fade-in" style={{ animationDelay: `${0.1 * idx}s` }}>
            <div className="card-header flex-between mb-3">
              <h3 className="card-title" style={{ fontSize: '1.2rem', margin: 0 }}>Pool {pool.pool_id.substring(0,8)}</h3>
              <span className="badge badge-primary">{pool.members.length} Members</span>
            </div>
            
            <div className="text-muted mb-4 text-sm flex gap-2" style={{ alignItems: 'center' }}>
              <ShieldCheck size={16} className="text-success inline-block" /> Active Coverage
            </div>

            <div className="text-sm" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div><span className="text-muted">Crops:</span> {Array.isArray(pool.crops) ? pool.crops.join(', ') : 'N/A'}</div>
              <div><span className="text-muted">Locations:</span> {Array.isArray(pool.locations) ? pool.locations.join(', ') : 'N/A'}</div>
              <div><span className="text-muted">Members:</span> {Array.isArray(pool.members) ? pool.members.join(', ') : 'N/A'}</div>
              <details>
                <summary style={{ cursor: 'pointer', color: 'var(--primary)' }}>Raw pool JSON</summary>
                <pre style={{ marginTop: '0.75rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {JSON.stringify(pool, null, 2)}
                </pre>
              </details>
            </div>

            <div className="flex-between pt-3" style={{ borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
              <span className="text-muted text-sm">Total Risk Value</span>
              <span className="font-semibold text-sm">Premium Group</span>
            </div>
          </div>
        )) : (
          <div className="card text-center text-muted col-span-full" style={{ gridColumn: '1 / -1' }}>No pools formed yet.</div>
        )}
      </div>
    </div>
  );
}
