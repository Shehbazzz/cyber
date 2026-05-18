import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import ProductCard from '../components/ProductCard';
import AddressBook from '../components/AddressBook';
import CheckoutDrawer from '../components/CheckoutDrawer';
import { useShipping } from '../hooks/useShipping';
import { usePromocode } from '../hooks/usePromocode';
import toast from 'react-hot-toast';

const DeviceBazaar = () => {
  const [products, setProducts] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');
  const { cartItems, getCartTotal } = useCart();
  const { user } = useAuth();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { shippingCost, updateShipping } = useShipping(selectedAddress?.city);
  const { applyPromocode, discount, promocodeError } = usePromocode();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    supabase.from('products').select('*').then(({ data }) => setProducts(data || []));
  }, []);

  const filteredProducts = products.filter(p => 
    filterQuery === '' || p.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
    p.tags?.some(tag => tag.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  const subtotal = getCartTotal();
  const total = subtotal + (subtotal >= 5000 ? 0 : shippingCost) - discount;

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <input 
          type="text" 
          placeholder="🔍 Filter by title or tag (ESP32, Wroom, Super Mini...)" 
          className="bg-black border border-neon-green/50 rounded px-4 py-2 w-full md:w-96 text-cyber-white focus:outline-none"
          value={filterQuery}
          onChange={e => setFilterQuery(e.target.value)}
        />
        <button onClick={() => setIsCheckoutOpen(true)} className="bg-neon-green/20 border border-neon-green px-4 py-2 rounded flex items-center gap-2">
          🛒 Cart ({cartItems.reduce((a,b)=>a+b.quantity,0)}) - Rs. {subtotal}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
      <CheckoutDrawer 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)}
        subtotal={subtotal}
        shippingCost={subtotal >= 5000 ? 0 : shippingCost}
        discount={discount}
        total={total}
        onApplyPromocode={applyPromocode}
        promocodeError={promocodeError}
        selectedAddress={selectedAddress}
        onAddressChange={setSelectedAddress}
      />
    </div>
  );
};

export default DeviceBazaar;