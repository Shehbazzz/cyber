import React, { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

export const PushContext = React.createContext();

export const PushProvider = ({ children }) => {
  const { user } = useAuth();

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const registration = await navigator.serviceWorker.register('/sw.js');
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
      });
      if (user) {
        await supabase.from('push_subscribers').upsert({ user_id: user.id, subscription });
      }
    }
  };

  useEffect(() => {
    if (user) registerServiceWorker();
  }, [user]);

  return <PushContext.Provider value={{}}>{children}</PushContext.Provider>;
};