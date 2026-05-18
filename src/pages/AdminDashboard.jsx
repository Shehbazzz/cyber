import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({ code: '', discount_type: 'percentage', discount_value: '', expiration_date: '' });
  const [pushMsg, setPushMsg] = useState({ title: '', body: '', icon: '', url: '' });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    const { data } = await supabase.from('coupons').select('*');
    setCoupons(data || []);
  };

  const addCoupon = async () => {
    await supabase.from('coupons').insert(newCoupon);
    fetchCoupons();
    toast.success('Coupon created');
  };

  const sendPushNotification = async () => {
    const { data: subs } = await supabase.from('push_subscribers').select('subscription');
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-push`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
      body: JSON.stringify({ subscriptions: subs.map(s => s.subscription), payload: pushMsg })
    });
    toast.success('Push sent');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl text-neon-green mb-6">Admin Control</h1>
      <div className="bg-glass-bg p-4 rounded border border-neon-green mb-6">
        <h2 className="text-xl mb-2">Create Coupon</h2>
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="Code (e.g., CYBER50)" className="bg-black p-2 border border-neon-green/50" onChange={e => setNewCoupon({...newCoupon, code: e.target.value})} />
          <select className="bg-black p-2 border border-neon-green/50" onChange={e => setNewCoupon({...newCoupon, discount_type: e.target.value})}>
            <option value="percentage">Percentage</option><option value="flat">Flat Rs.</option>
          </select>
          <input type="number" placeholder="Value" onChange={e => setNewCoupon({...newCoupon, discount_value: parseInt(e.target.value)})} />
          <input type="date" onChange={e => setNewCoupon({...newCoupon, expiration_date: e.target.value})} />
        </div>
        <button onClick={addCoupon} className="mt-3 bg-neon-green/30 px-4 py-1 rounded">Add Coupon</button>
        <div className="mt-4">{coupons.map(c => <div key={c.id} className="text-sm">{c.code} - {c.discount_value}{c.discount_type==='percentage'?'%':'Rs'}</div>)}</div>
      </div>
      <div className="bg-glass-bg p-4 rounded border border-neon-green">
        <h2 className="text-xl mb-2">Send Web Push Notification</h2>
        <input placeholder="Title" className="w-full bg-black p-2 mb-2 border border-neon-green/50" onChange={e => setPushMsg({...pushMsg, title: e.target.value})} />
        <textarea placeholder="Body" className="w-full bg-black p-2 mb-2 border border-neon-green/50" onChange={e => setPushMsg({...pushMsg, body: e.target.value})} />
        <input placeholder="Icon URL (optional)" className="w-full bg-black p-2 mb-2" onChange={e => setPushMsg({...pushMsg, icon: e.target.value})} />
        <input placeholder="Redirect URL" className="w-full bg-black p-2 mb-4" onChange={e => setPushMsg({...pushMsg, url: e.target.value})} />
        <button onClick={sendPushNotification} className="bg-neon-green/30 px-6 py-2 rounded">Broadcast Push</button>
      </div>
    </div>
  );
};

export default AdminDashboard;