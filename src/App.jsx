import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { PushProvider } from './contexts/PushContext';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import DevHub from './pages/DevHub';
import DeviceBazaar from './pages/DeviceBazaar';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate minimum preloader display (2 sec) but also wait for content
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Preloader />;

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <PushProvider>
            <div className="min-h-screen" style={{backgroundColor:"#0a0a0a",color:"#00ff00",minHeight:"100vh"}}>
              <Navbar />
              <Routes>
                <Route path="/devhub" element={<DevHub />} />
                <Route path="/devicebazaar" element={<DeviceBazaar />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/" element={<DeviceBazaar />} />
              </Routes>
            </div>
          </PushProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;