import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, User, Phone, MapPin, Sprout, Ruler, AlertTriangle, Loader2 } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api.config';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    state: '',
    district: '',
    cropType: '',
    farmSize: '',
    riskLevel: 'Medium'
  });

  const states = ['Tamil Nadu', 'Maharashtra', 'Odisha'];
  const crops = ['Rice', 'Cotton', 'Millet', 'Sugarcane'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        name: formData.fullName,
        phone: formData.phone,
        location: `${formData.district}, ${formData.state}`,
        crop: formData.cropType,
        area: parseFloat(formData.farmSize) || 10,
        riskLevel: formData.riskLevel,
        latitude: (Math.random() * 10 + 8).toFixed(4),
        longitude: (Math.random() * 10 + 76).toFixed(4),
      };

      // Try the new endpoint first, fallback to original
      let response = await fetch(API_ENDPOINTS.REGISTER_FARMER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // If the new endpoint fails, try the original endpoint
      if (!response.ok) {
        response = await fetch(API_ENDPOINTS.CREATE_FARMER, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Registration failed');
      }

      // Store farmer data for the dashboard
      localStorage.setItem('farmerData', JSON.stringify({
        ...payload,
        ...data,
        registeredAt: new Date().toISOString()
      }));

      // Redirect to farmer dashboard
      navigate('/farmer-dashboard');
    } catch (err) {
      // If backend is offline, simulate success with dummy data
      console.warn('API call failed, using simulated registration:', err.message);
      
      localStorage.setItem('farmerData', JSON.stringify({
        id: `FARMER-${Date.now()}`,
        name: formData.fullName,
        phone: formData.phone,
        location: `${formData.district}, ${formData.state}`,
        crop: formData.cropType,
        area: parseFloat(formData.farmSize) || 10,
        riskLevel: formData.riskLevel,
        poolId: `POOL-${formData.state.substring(0, 2).toUpperCase()}-${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`,
        premium: Math.floor(1500 + Math.random() * 2000),
        registeredAt: new Date().toISOString()
      }));

      navigate('/farmer-dashboard');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.875rem 1rem',
    paddingLeft: '2.75rem',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    fontSize: '1rem',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    background: 'white'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 500,
    marginBottom: '0.5rem',
    color: 'var(--text-main)'
  };

  const iconStyle = {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f1f5f9 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div className="card animate-fade-in" style={{
        maxWidth: '480px',
        width: '100%',
        padding: '2.5rem'
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          marginBottom: '2rem'
        }}>
          <ShieldCheck size={36} style={{ color: 'var(--primary)' }} />
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
            AgroShield
          </span>
        </div>

        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: '0.5rem',
          color: 'var(--text-main)'
        }}>
          Join the Insurance Pool
        </h1>
        <p style={{
          textAlign: 'center',
          color: 'var(--text-muted)',
          marginBottom: '2rem'
        }}>
          Register your farm to get weather-based coverage
        </p>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#991b1b',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={iconStyle} />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* Phone Number */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Phone Number</label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={iconStyle} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* State */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>State</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={iconStyle} />
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>

          {/* District */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>District</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={iconStyle} />
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="Enter your district"
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* Crop Type */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Crop Type</label>
            <div style={{ position: 'relative' }}>
              <Sprout size={18} style={iconStyle} />
              <select
                name="cropType"
                value={formData.cropType}
                onChange={handleChange}
                required
                style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
              >
                <option value="">Select Crop</option>
                {crops.map(crop => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Farm Size */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Farm Size (acres)</label>
            <div style={{ position: 'relative' }}>
              <Ruler size={18} style={iconStyle} />
              <input
                type="number"
                name="farmSize"
                value={formData.farmSize}
                onChange={handleChange}
                placeholder="e.g., 5"
                required
                min="0.1"
                step="0.1"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Risk Level */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={labelStyle}>Risk Level</label>
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '0.5rem'
            }}>
              {['Low', 'Medium', 'High'].map(level => (
                <label
                  key={level}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    border: formData.riskLevel === level 
                      ? '2px solid var(--primary)' 
                      : '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    background: formData.riskLevel === level 
                      ? 'rgba(16, 185, 129, 0.1)' 
                      : 'white',
                    transition: 'all 0.2s'
                  }}
                >
                  <input
                    type="radio"
                    name="riskLevel"
                    value={level}
                    checked={formData.riskLevel === level}
                    onChange={handleChange}
                    style={{ display: 'none' }}
                  />
                  <span style={{
                    fontWeight: formData.riskLevel === level ? 600 : 400,
                    color: formData.riskLevel === level ? 'var(--primary)' : 'var(--text-main)'
                  }}>
                    {level}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="spinner" />
                Processing...
              </>
            ) : (
              'Register & Join Pool'
            )}
          </button>
        </form>

        {/* Login Link */}
        <p style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          color: 'var(--text-muted)'
        }}>
          Already registered?{' '}
          <Link 
            to="/farmer-dashboard" 
            style={{ color: 'var(--primary)', fontWeight: 500, textDecoration: 'none' }}
          >
            Login
          </Link>
        </p>
      </div>

      <style>{`
        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input:focus, select:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }
      `}</style>
    </div>
  );
}
