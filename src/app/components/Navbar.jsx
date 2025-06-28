'use client';

import Link from 'next/link';
import { supabase } from '@/utils/supabaseClient';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import {
  FaCode,
  FaSun,
  FaMoon,
  FaUser,
  FaSignOutAlt,
  FaUserCircle,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

export default function Navbar({ user, darkMode, toggleDarkMode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  // Navigation links for reuse
  const navLinks = (
    <>
      <CustomNavLink href="/dashboard" pathname={pathname}>Dashboard</CustomNavLink>
      <CustomNavLink href="/leaderboard" pathname={pathname}>Leaderboard</CustomNavLink>
      <CustomNavLink href="/solved" pathname={pathname}>Solved</CustomNavLink>
    </>
  );

  return (
    <nav className="flex items-center justify-between py-4 px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 w-full relative z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-indigo-700 dark:text-indigo-300 tracking-tight">
        <FaCode className="text-indigo-600 dark:text-indigo-400" />
        DSA Tracker
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-4">
        {navLinks}
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

      {/* Hamburger for mobile */}
      <button
        className="md:hidden p-2 rounded-full text-2xl text-indigo-700 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-gray-800 transition"
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Open menu"
      >
        <FaBars />
      </button>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-row-reverse md:hidden">
          {/* Drawer */}
          <div className="w-72 max-w-full h-full bg-white dark:bg-gray-900 shadow-lg flex flex-col p-6 gap-4 relative animate-slide-in-right">
            <div className="flex items-center justify-between mb-6">
              <span className="flex items-center gap-2 text-xl font-bold text-indigo-700 dark:text-indigo-300">
                <FaCode className="text-indigo-600 dark:text-indigo-400" />
                DSA Tracker
              </span>
              <button
                className="p-2 rounded-full text-2xl text-indigo-700 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-gray-800 transition"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <FaTimes />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {navLinks}
              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition hover:bg-indigo-100 dark:hover:bg-gray-800 text-indigo-700 dark:text-indigo-200 text-left"
                title="Toggle dark mode"
              >
                {darkMode
                  ? <FaSun className="text-yellow-500" />
                  : <FaMoon className="text-indigo-700 dark:text-indigo-300" />}
                <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              {user ? (
                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition hover:bg-indigo-100 dark:hover:bg-gray-800 text-indigo-700 dark:text-indigo-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaUser /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 rounded-lg font-semibold transition hover:bg-red-100 dark:hover:bg-gray-800 text-red-600 dark:text-red-400 mt-2"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              ) : (
                <CustomNavLink href="/login" pathname={pathname}>Login</CustomNavLink>
              )}
            </div>
          </div>
          {/* Overlay */}
          <div
            className="flex-1 h-full bg-black bg-opacity-40"
            onClick={() => setMobileMenuOpen(false)}
          />
        </div>
      )}

      {/* Slide-in animation */}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0%);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.2s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </nav>
  );
}

function CustomNavLink({ href, pathname, children }) {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-lg font-semibold transition block ${
        isActive
          ? 'bg-indigo-600 text-white dark:bg-indigo-400 dark:text-gray-900'
          : 'text-indigo-700 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-gray-800'
      }`}
    >
      {children}
    </Link>
  );
}
