import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { cartItems } = useCart();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);

  const cartCount = cartItems.reduce((a, b) => a + b.quantity, 0);

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out');
  };

  return (
    <nav className="sticky top-0 z-40 bg-matrix-black/90 backdrop-blur-sm border-b border-neon-green/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-neon-green font-bold text-xl tracking-wider">
            ⚡ SHEHBAZ<span className="text-white">//</span>CYBER
          </Link>

          <div className="hidden md:flex space-x-6">
            <Link to="/devhub" className={`hover:text-neon-green transition ${location.pathname === '/devhub' ? 'text-neon-green' : ''}`}>
              DEV_HUB
            </Link>
            <Link to="/devicebazaar" className={`hover:text-neon-green transition ${location.pathname === '/devicebazaar' ? 'text-neon-green' : ''}`}>
              DEVICE_BAZAAR
            </Link>
            {user?.email === 'admin@example.com' && (
              <Link to="/admin" className={`hover:text-neon-green transition ${location.pathname === '/admin' ? 'text-neon-green' : ''}`}>
                ADMIN
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/devicebazaar" className="relative">
              <span className="text-xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-neon-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="relative">
              <button onClick={() => setShowProfile(!showProfile)} className="focus:outline-none">
                <div className="w-8 h-8 rounded-full border border-neon-green bg-black flex items-center justify-center">
                  <span className="text-neon-green text-sm">👤</span>
                </div>
              </button>
              {showProfile && (
                <div className="absolute right-0 mt-2 w-48 bg-matrix-black border border-neon-green rounded shadow-lg z-50">
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-sm border-b border-neon-green/30">{user.email}</div>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-neon-red hover:bg-neon-green/10">Logout</button>
                    </>
                  ) : (
                    <button
                      onClick={() => toast.error('Auth demo: use Supabase Auth UI')}
                      className="block w-full text-left px-4 py-2 hover:bg-neon-green/10"
                    >
                      Login / Signup
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;