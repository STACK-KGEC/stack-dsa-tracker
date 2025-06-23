'use client';

import Link from 'next/link';
import { supabase } from '@/utils/supabaseClient';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { FaCode, FaSun, FaMoon, FaUser, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

export default function Navbar({ user, darkMode, toggleDarkMode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const avatarRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

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
        <CustomNavLink href="/dashboard" pathname={pathname}>Dashboard</CustomNavLink>
        <CustomNavLink href="/leaderboard" pathname={pathname}>Leaderboard</CustomNavLink>
        <CustomNavLink href="/solved" pathname={pathname}>Solved</CustomNavLink>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full text-xl hover:bg-indigo-100 dark:hover:bg-gray-800 transition"
          title="Toggle dark mode"
        >
          {darkMode
            ? <FaSun className="text-yellow-500" />
            : <FaMoon className="text-indigo-700 dark:text-indigo-300" />}
        </button>
        {user ? (
          <div className="relative" ref={avatarRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 dark:bg-indigo-400 text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              title="User menu"
            >
              {user.email[0]?.toUpperCase() || <FaUserCircle />}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-3 hover:bg-indigo-100 dark:hover:bg-gray-800 text-indigo-700 dark:text-indigo-200 font-semibold rounded-t-xl transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  <FaUser /> Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-3 hover:bg-red-100 dark:hover:bg-gray-800 text-red-600 dark:text-red-400 font-semibold rounded-b-xl transition text-left"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <CustomNavLink href="/login" pathname={pathname}>Login</CustomNavLink>
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
