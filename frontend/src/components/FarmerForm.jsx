import { useState } from 'react';
import { UserPlus, MapPin, Sprout, AlertTriangle, CheckCircle } from 'lucide-react';

export default function FarmerForm({ onFarmerAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    crop: '',
    riskLevel: 'Low' // Low, Medium, High
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        ...formData,
        area: Math.floor(Math.random() * 50) + 10, // dummy area
        latitude: (Math.random() * 180 - 90).toFixed(4), // dummy lat
        longitude: (Math.random() * 360 - 180).toFixed(4), // dummy lon
      };

      const response = await fetch('/create-farmer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to create farmer');
      }

      setSuccess(true);
      setFormData({ name: '', location: '', crop: '', riskLevel: 'Low' });
      
      if (onFarmerAdded) {
        onFarmerAdded(data);
      }
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card animate-fade-in" style={{ padding: '2rem' }}>
      <div className="card-header" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <h2 className="card-title" style={{ fontSize: '1.25rem' }}>
          <div style={{ padding: '0.5rem', background: '#f1f5f9', borderRadius: '8px', display: 'flex' }}>
            <UserPlus size={20} className="text-primary" />
          </div>
          Farmer Details
        </h2>
      </div>
      
      {success && (
        <div className="mb-4 flex-between badge badge-success" style={{ padding: '0.75rem', borderRadius: '8px', width: '100%', whiteSpace: 'normal', textAlign: 'left' }}>
          <span className="flex-between gap-2" style={{ justifyContent: 'flex-start' }}><CheckCircle size={16} /> Successfully registered and placed in pool.</span>
        </div>
      )}
      
      {error && (
        <div className="mb-4 flex-between badge badge-danger" style={{ padding: '0.75rem', borderRadius: '8px', width: '100%', whiteSpace: 'normal', textAlign: 'left' }}>
          <span className="flex-between gap-2" style={{ justifyContent: 'flex-start' }}><AlertTriangle size={16} style={{ flexShrink: 0 }} /> {error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <div style={{ position: 'relative' }}>
            <UserPlus size={18} style={{ position: 'absolute', left: '1rem', top: '0.85rem', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className="form-input" 
              style={{ paddingLeft: '2.5rem' }} 
              placeholder="e.g. John Doe"
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Location</label>
          <div style={{ position: 'relative' }}>
            <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '0.85rem', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              name="location" 
              value={formData.location} 
              onChange={handleChange} 
              className="form-input" 
              style={{ paddingLeft: '2.5rem' }} 
              placeholder="e.g. Village District"
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Crop Type</label>
          <div style={{ position: 'relative' }}>
            <Sprout size={18} style={{ position: 'absolute', left: '1rem', top: '0.85rem', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              name="crop" 
              value={formData.crop} 
              onChange={handleChange} 
              className="form-input" 
              style={{ paddingLeft: '2.5rem' }} 
              placeholder="e.g. Wheat"
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Risk Level Indicator</label>
          <div style={{ position: 'relative' }}>
            <AlertTriangle size={18} style={{ position: 'absolute', left: '1rem', top: '0.85rem', color: 'var(--text-muted)' }} />
            <select 
              name="riskLevel" 
              value={formData.riskLevel} 
              onChange={handleChange} 
              className="form-select" 
              style={{ paddingLeft: '2.5rem' }}
            >
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Processing...' : 'Register Farmer'}
        </button>
      </form>
    </div>
  );
}
