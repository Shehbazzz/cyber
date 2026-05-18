import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const AddressBook = ({ onSelect, selectedId }) => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ full_name: '', address_line: '', city: '', phone: '' });

  useEffect(() => {
    if (user) fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    const { data } = await supabase.from('addresses').select('*').eq('user_id', user.id);
    setAddresses(data || []);
    if (data?.length && !selectedId && onSelect) onSelect(data[0]);
  };

  const saveAddress = async () => {
    if (!form.full_name || !form.address_line || !form.city || !form.phone) {
      toast.error('All fields required');
      return;
    }
    const { error } = await supabase.from('addresses').insert({ ...form, user_id: user.id });
    if (error) toast.error(error.message);
    else {
      toast.success('Address saved');
      fetchAddresses();
      setShowForm(false);
      setForm({ full_name: '', address_line: '', city: '', phone: '' });
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-neon-green mb-2">Shipping Address</h3>
      {addresses.map(addr => (
        <div
          key={addr.id}
          className={`p-2 mb-2 border rounded cursor-pointer ${selectedId === addr.id ? 'border-neon-green bg-neon-green/10' : 'border-gray-700'}`}
          onClick={() => onSelect(addr)}
        >
          <p className="font-bold">{addr.full_name}</p>
          <p className="text-sm">{addr.address_line}, {addr.city}</p>
          <p className="text-sm">{addr.phone}</p>
        </div>
      ))}
      <button onClick={() => setShowForm(!showForm)} className="text-neon-green text-sm underline">
        {showForm ? 'Cancel' : '+ New Address'}
      </button>
      {showForm && (
        <div className="mt-2 space-y-2">
          <input placeholder="Full Name" className="neon-input w-full" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} />
          <input placeholder="Address Line" className="neon-input w-full" value={form.address_line} onChange={e => setForm({...form, address_line: e.target.value})} />
          <input placeholder="City" className="neon-input w-full" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
          <input placeholder="Phone Number" className="neon-input w-full" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <button onClick={saveAddress} className="neon-button w-full">Save Address</button>
        </div>
      )}
    </div>
  );
};

export default AddressBook;