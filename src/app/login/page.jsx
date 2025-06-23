'use client';
import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';
import { FaCode } from 'react-icons/fa';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.replace('/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-10 flex flex-col gap-7 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <FaCode className="text-3xl text-indigo-600 dark:text-indigo-400" />
          <span className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300 tracking-tight">DSA Tracker</span>
        </div>
        <h1 className="text-2xl font-bold text-center text-primary dark:text-primary-dark mb-2">
          Login
        </h1>
        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-lg focus:ring-2 focus:ring-primary focus:border-primary dark:focus:ring-primary-dark dark:focus:border-primary-dark transition"
        />
        <input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-lg focus:ring-2 focus:ring-primary focus:border-primary dark:focus:ring-primary-dark dark:focus:border-primary-dark transition"
        />
        {error && <div className="text-red-600 dark:text-red-400 text-center font-semibold">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="bg-primary dark:bg-primary-dark hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition text-xl mt-2"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
