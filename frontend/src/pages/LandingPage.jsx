import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, Users, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Zero Claim Forms",
      description: "Automatic payouts triggered by weather data. No paperwork, no delays."
    },
    {
      icon: Clock,
      title: "48hr Automatic Payout",
      description: "Receive compensation within 48 hours when weather conditions trigger your policy."
    },
    {
      icon: Users,
      title: "Group Pool Pricing",
      description: "Join a peer-to-peer insurance pool for affordable, community-based coverage."
    }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1a4d1c 0%, #2C5F2D 50%, #3d7a3f 100%)',
        color: 'white',
        padding: '6rem 1.5rem',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%)`,
          pointerEvents: 'none'
        }} />

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '2.5rem'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '16px',
              padding: '1rem',
              backdropFilter: 'blur(10px)'
            }}>
              <ShieldCheck size={56} strokeWidth={1.5} />
            </div>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 800,
              letterSpacing: '-2px',
              margin: 0
            }}>
              AgroShield
            </h1>
          </div>

          {/* Headline */}
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              fontWeight: 700,
              marginBottom: '1.5rem',
              lineHeight: 1.2
            }}>
              Protecting Farmers Against Weather Risks — Automatically
            </h2>
            
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              opacity: 0.9,
              marginBottom: '3rem',
              lineHeight: 1.6
            }}>
              Join a peer-to-peer insurance pool. Pay affordable premiums. 
              Get paid in 48 hours when weather fails you.
            </p>

            {/* CTA Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link
                to="/register"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 2rem',
                  background: 'white',
                  color: '#2C5F2D',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.15)';
                }}
              >
                Join as Farmer
                <ArrowRight size={20} />
              </Link>
              
              <Link
                to="/farmer-dashboard"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 2rem',
                  background: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  textDecoration: 'none',
                  border: '2px solid rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(10px)',
                  transition: 'background 0.2s, border-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                }}
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        background: 'var(--bg-color)',
        padding: '4rem 1.5rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {features.map((feature, index) => (
            <div
              key={index}
              className="card animate-fade-in"
              style={{
                animationDelay: `${index * 0.1}s`,
                textAlign: 'center',
                padding: '2.5rem 2rem'
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <feature.icon size={28} style={{ color: '#166534' }} />
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                marginBottom: '0.75rem',
                color: 'var(--text-main)'
              }}>
                {feature.title}
              </h3>
              <p style={{
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                margin: 0
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#1a1a1a',
        color: 'rgba(255,255,255,0.7)',
        padding: '2rem 1.5rem',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '0.5rem'
        }}>
          <ShieldCheck size={20} style={{ color: '#10b981' }} />
          <span style={{ fontWeight: 600, color: 'white' }}>AgroShield</span>
        </div>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>
          AgroShield &copy; 2026. Protecting farmers with smart insurance.
        </p>
      </footer>
    </div>
  );
}
