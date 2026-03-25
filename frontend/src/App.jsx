import { useState } from 'react';
import FarmerForm from './components/FarmerForm';
import Dashboard from './components/Dashboard';
import { ShieldCheck } from 'lucide-react';
import './index.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFarmerAdded = () => {
    // Refresh dashboard data
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen">
      <header className="hero-header" style={{ background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))', color: 'white', padding: '3rem 0 4rem 0' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem', padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
            <ShieldCheck size={48} style={{ color: '#fff' }} />
            <h1 style={{ fontSize: '3rem', margin: 0, fontWeight: 800, letterSpacing: '-1px' }}>AgroShield</h1>
          </div>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
            Next-Generation Parametric Crop Insurance Platform. Protecting farmers automatically against weather risks.
          </p>
        </div>
      </header>

      <main className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', marginTop: '-3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 2.5fr', gap: '2.5rem', alignItems: 'start' }} className="responsive-grid">
          {/* Sidebar / Form */}
          <aside style={{ position: 'sticky', top: '2rem' }}>
            <div className="section-heading">
              <h2>Farmer Registration</h2>
              <p>Onboard new farmers into the risk pool</p>
            </div>
            <FarmerForm onFarmerAdded={handleFarmerAdded} />
          </aside>

          {/* Main Dashboard Area */}
          <section>
            <div className="section-heading">
              <h2>Platform Dashboard</h2>
              <p>Real-time analytics and payout operations</p>
            </div>
            <Dashboard refreshTrigger={refreshTrigger} />
          </section>
        </div>
      </main>
      <style>{`
        @media (max-width: 768px) {
          .responsive-grid {
            grid-template-columns: 1fr !important;
          }
          aside {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
