import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

const CheckoutDrawer = ({ isOpen, onClose, subtotal, shippingCost, discount, total, onApplyPromocode, promocodeError, selectedAddress, onAddressChange }) => {
  const { user } = useAuth();
  const { cartItems, clearCart } = useCart();
  const [txid, setTxid] = useState('');
  const [txidValid, setTxidValid] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [orderPlacing, setOrderPlacing] = useState(false);

  const validateTxid = async (value) => {
    setTxid(value);
    const formatValid = /^\d{11,12}$/.test(value);
    if (!formatValid) return setTxidValid(false);
    const { data } = await supabase.from('hardware_orders').select('txid').eq('txid', value);
    const duplicate = data && data.length > 0;
    setTxidValid(!duplicate);
    if (duplicate) toast.error('TxID already used');
  };

  const placeOrder = async () => {
    if (!txidValid || !selectedAddress || cartItems.length === 0) return;
    setOrderPlacing(true);
    const orderData = {
      user_id: user.id,
      txid,
      total_amount: total,
      shipping_cost: shippingCost,
      discount_amount: discount,
      promo_code: promoInput,
      address_id: selectedAddress.id,
      items: cartItems,
    };
    const { error } = await supabase.from('hardware_orders').insert(orderData);
    if (error) return toast.error('Order failed');
    
    // Call email edge function
    await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-order-emails`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: orderData, userEmail: user.email, adminEmail: 'admin@example.com' })
    });
    toast.success('Order placed! Check email.');
    clearCart();
    onClose();
    setOrderPlacing(false);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
      <div className="w-full max-w-md bg-matrix-black border-l border-neon-green p-6 overflow-auto">
        <h2 className="text-2xl text-neon-green mb-4">Checkout</h2>
        <div className="mb-4 p-3 border border-neon-green/40 rounded">
          <p className="text-sm">💳 JazzCash Wallet (Hardcoded)</p>
          <p>Account Title: Muhammed Rafeeq</p>
          <p>Account Number: 03212844383</p>
        </div>
        <input type="text" placeholder="Paste 11-12 Digit TxID from SMS" className="w-full bg-black border border-neon-green rounded p-2 mb-2" value={txid} onChange={e => validateTxid(e.target.value)} />
        {txid && !txidValid && <p className="text-neon-red text-sm">Invalid or Expired TxID</p>}
        
        <AddressBook onSelect={onAddressChange} selectedId={selectedAddress?.id} />
        
        <div className="flex gap-2 mt-4">
          <input type="text" placeholder="Promo Code" className="flex-1 bg-black border border-neon-green/50 rounded p-2" value={promoInput} onChange={e => setPromoInput(e.target.value)} />
          <button onClick={() => onApplyPromocode(promoInput, subtotal)} className="bg-neon-green/20 px-3 rounded">Apply</button>
        </div>
        {promocodeError && <p className="text-neon-red text-sm">{promocodeError}</p>}
        
        <div className="mt-4 space-y-2">
          <p>Subtotal: Rs. {subtotal}</p>
          <p>Shipping: Rs. {subtotal >= 5000 ? 0 : shippingCost}</p>
          <p>Discount: -Rs. {discount}</p>
          <p className="text-xl text-neon-green">Total: Rs. {total}</p>
        </div>
        
        <button 
          disabled={!txidValid || !selectedAddress || orderPlacing} 
          className={`w-full mt-6 py-3 rounded font-bold transition-all ${txidValid && selectedAddress ? 'bg-neon-green text-black hover:shadow-neon' : 'bg-gray-600 cursor-not-allowed'}`}
          onClick={placeOrder}
        >
          {orderPlacing ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default CheckoutDrawer;