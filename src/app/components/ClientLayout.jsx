'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import Navbar from './Navbar';

export default function ClientLayout({ children }) {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Only allow / and /login without authentication
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user && pathname !== '/' && pathname !== '/login') {
        router.replace('/login');
      }
      if (user && (pathname === '/login' || pathname === '/')) {
        router.replace('/dashboard');
      }
    };
    checkUser();
  }, [pathname, router]);

  // Dark mode logic
  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(storedDarkMode);
    document.documentElement.classList.toggle('dark', storedDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-200 dark:from-gray-900 dark:to-gray-800">
      <Navbar user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="max-w-4xl mx-auto px-4 py-10">{children}</main>
    </div>
  );
}
