'use client';
import Link from 'next/link';
import { FaCode, FaUserFriends, FaTrophy, FaChartLine, FaLock } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Glowing Logo */}
      <div className="flex justify-center mt-20 mb-8">
        <div className="relative flex items-center justify-center">
          <span className="absolute inline-block w-28 h-28 rounded-full bg-gradient-to-br from-indigo-400 via-indigo-600 to-indigo-800 blur-2xl opacity-60 animate-pulse"></span>
          <span className="relative z-10 flex items-center justify-center w-28 h-28 rounded-full bg-white dark:bg-gray-900 shadow-2xl border-4 border-indigo-500">
            <FaCode className="text-6xl text-indigo-700 dark:text-indigo-300" />
          </span>
        </div>
      </div>

      {/* Main Title */}
      <h1 className="text-center text-5xl md:text-6xl font-extrabold text-indigo-700 dark:text-indigo-200 tracking-tight drop-shadow-lg mb-4">
        DSA Tracker
      </h1>
      <p className="text-center text-xl md:text-s text-gray-700 dark:text-gray-200 font-medium mb-10 max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <span className="inline-flex items-center gap-2">
          <FaLock className="inline text-indigo-400" /> Secure
        </span>
        <span className="text-2xl text-gray-400 dark:text-gray-600 mx-2">•</span>
        <span className="inline-flex items-center gap-2">
          <FaUserFriends className="inline text-indigo-400" /> Social
        </span>
        <span className="text-2xl text-gray-400 dark:text-gray-600 mx-2">•</span>
        <span className="inline-flex items-center gap-2">
          <FaTrophy className="inline text-indigo-400" /> Competitive
        </span>
        <span className="text-2xl text-gray-400 dark:text-gray-600 mx-2">•</span>
        <span className="inline-flex items-center gap-2">
          <FaChartLine className="inline text-indigo-400" /> Insightful
        </span>
      </p>


      {/* Call To Action */}
      <div className="flex justify-center mb-16">
        <Link
          href="/login"
          className="inline-block bg-gradient-to-r from-indigo-700 via-indigo-500 to-blue-400
            hover:from-indigo-800 hover:to-blue-500
            text-white text-3xl font-extrabold tracking-tight
            px-16 py-6 rounded-3xl shadow-2xl
            transition-all duration-300
            ring-4 ring-indigo-300/50 hover:ring-8
            glow-smooth"
          style={{ letterSpacing: '0.04em' }}
        >
          Login to Get Started
        </Link>
      </div>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 mb-20 px-4">
        <FeatureCard
          icon={<FaTrophy className="text-4xl text-yellow-400 mb-3" />}
          title="Compete on the Leaderboard"
          description="Climb daily, weekly, monthly, and all-time leaderboards. Earn coins for every problem solved and see your progress live."
        />
        <FeatureCard
          icon={<FaUserFriends className="text-4xl text-green-400 mb-3" />}
          title="Track With Friends"
          description="See your friends' progress, compare stats, and motivate each other to stay consistent in your DSA journey."
        />
        <FeatureCard
          icon={<FaChartLine className="text-4xl text-blue-400 mb-3" />}
          title="Visualize Your Growth"
          description="Get beautiful charts and insights into your problem-solving habits, strengths, and improvement areas."
        />
        <FeatureCard
          icon={<FaLock className="text-4xl text-indigo-400 mb-3" />}
          title="Private & Secure"
          description="Your data is protected. Only you and your friends can see your progress. No spam, no distractions."
        />
      </section>

      {/* Divider */}
      <div className="w-full border-t border-indigo-200 dark:border-indigo-800 my-8"></div>

      {/* Credits */}
      <footer className="flex flex-col items-center mb-8 gap-2">
        <span className="text-2xl text-gray-700 dark:text-gray-300 font-extrabold mb-2 tracking-wide">Credits</span>
        <div className="flex flex-wrap items-center gap-4 text-indigo-700 dark:text-indigo-300 font-bold text-lg">
          <a
            href="https://stack-kgec.pages.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            STACK KGEC ✨
          </a>
          <span className="text-2xl text-gray-400 dark:text-gray-600">•</span>
          <a
            href="https://www.linkedin.com/in/agniva-hait-49508630a/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Agniva Hait ❤️
          </a>
          <span className="text-2xl text-gray-400 dark:text-gray-600">•</span>
          <a
            href="https://linkedin.com/in/dwaidatta"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Dwaipayan Datta ☕
          </a>
        </div>
      </footer>


    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center hover:scale-105 transition-transform duration-300">
      {icon}
      <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-2 text-center">{title}</div>
      <div className="text-gray-700 dark:text-gray-300 text-lg text-center">{description}</div>
    </div>
  );
}
