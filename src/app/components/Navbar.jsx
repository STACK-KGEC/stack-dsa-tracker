'use client';

import Link from 'next/link';
import { supabase } from '@/utils/supabaseClient';
import { useRouter, usePathname } from 'next/navigation';
import { FaCode, FaSun, FaMoon } from 'react-icons/fa';

export default function Navbar({ user, darkMode, toggleDarkMode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  return (
    <nav className="flex items-center justify-between py-4 px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 w-full">
      <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-indigo-700 dark:text-indigo-300 tracking-tight">
        <FaCode className="text-indigo-600 dark:text-indigo-400" />
        DSA Tracker
      </Link>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <CustomNavLink href="/dashboard" pathname={pathname}>Dashboard</CustomNavLink>
            <CustomNavLink href="/leaderboard" pathname={pathname}>Leaderboard</CustomNavLink>
            <CustomNavLink href="/solved" pathname={pathname}>Solved</CustomNavLink>
            <CustomNavLink href="/profile" pathname={pathname}>Profile</CustomNavLink>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-xl hover:bg-indigo-100 dark:hover:bg-gray-800 transition"
              title="Toggle dark mode"
            >
              {darkMode
                ? <FaSun className="text-yellow-500" />
                : <FaMoon className="text-indigo-700 dark:text-indigo-300" />}
            </button>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-indigo-600 dark:bg-indigo-400 text-white font-bold text-lg">
                {user.email[0].toUpperCase()}
              </span>
              <button
                onClick={handleLogout}
                className="ml-2 text-sm text-red-600 dark:text-red-400 font-semibold hover:underline"
              >
                Logout
              </button>
            </div>
          </>
        )}
        {!user && (
          <>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-xl hover:bg-indigo-100 dark:hover:bg-gray-800 transition"
              title="Toggle dark mode"
            >
              {darkMode
                ? <FaSun className="text-yellow-500" />
                : <FaMoon className="text-indigo-700 dark:text-indigo-300" />}
            </button>
            <CustomNavLink href="/login" pathname={pathname}>Login</CustomNavLink>
          </>
        )}
      </div>
    </nav>
  );
}

function CustomNavLink({ href, pathname, children }) {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-lg font-semibold transition ${
        isActive
          ? 'bg-indigo-600 text-white dark:bg-indigo-400 dark:text-gray-900'
          : 'text-indigo-700 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-gray-800'
      }`}
    >
      {children}
    </Link>
  );
}
