import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import FarmerDashboard from './pages/FarmerDashboard';
import PoolDashboard from './pages/PoolDashboard';
import AdminPage from './pages/AdminPage';
import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
      <Route path="/pool-dashboard" element={<PoolDashboard />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
