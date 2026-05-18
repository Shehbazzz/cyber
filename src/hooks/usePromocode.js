import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export const usePromocode = () => {
  const [discount, setDiscount] = useState(0);
  const [promocodeError, setPromocodeError] = useState('');

  const applyPromocode = async (code, subtotal) => {
    setPromocodeError('');
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('active', true)
      .single();
    
    if (error || !data || new Date(data.expiration_date) < new Date()) {
      setPromocodeError('Invalid or expired coupon');
      return 0;
    }
    let discValue = data.discount_type === 'percentage' ? (subtotal * data.discount_value / 100) : data.discount_value;
    setDiscount(Math.min(discValue, subtotal));
    return discValue;
  };
  return { discount, applyPromocode, promocodeError };
};