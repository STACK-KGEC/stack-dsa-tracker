'use client';
import Link from 'next/link';
import { FaCode, FaUserFriends, FaTrophy, FaChartLine, FaLock, FaGithub } from 'react-icons/fa';

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
      <p className="text-center text-xl md:text-s text-gray-700 dark:text-gray-200 font-medium max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
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
      <div className="flex justify-center mt-20 mb-20">
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





    





    <section className="max-w-5xl mb-16 px-4">
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 justify-center">
        {/* Credits Block */}
        <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center">
          <span className="text-2xl text-indigo-700 dark:text-indigo-300 font-extrabold mb-4 tracking-wide flex items-center gap-2">
            <FaUserFriends className="text-indigo-400" /> Credits
          </span>
          <div className="flex flex-col gap-3 items-center text-indigo-700 dark:text-indigo-300 font-bold text-lg">
            <a
              href="https://stack-kgec.pages.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-2"
            >
              STACK KGEC
            </a>
            <a
              href="https://www.linkedin.com/in/agniva-hait-49508630a/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-2"
            >
              Agniva Hait
            </a>
            <a
              href="https://linkedin.com/in/dwaidatta"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-2"
            >
              Dwaipayan Datta
            </a>
          </div>
        </div>
        {/* Contribute Block */}
        <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center">
          <span className="text-2xl text-indigo-700 dark:text-indigo-300 font-extrabold mb-4 tracking-wide flex items-center gap-2">
            <FaCode className="text-indigo-400" /> Contribute
          </span>
          <Link
            href="https://github.com/STACK-KGEC/stack-dsa-tracker"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white dark:bg-gray-800 px-6 py-3 rounded-xl shadow hover:bg-indigo-100 dark:hover:bg-gray-700 text-indigo-700 dark:text-indigo-300 font-bold text-lg transition m-auto"
          >
            <FaGithub className="text-2xl" />
            Open Source on GitHub
          </Link>
          <span className="text-xs mt-3 text-gray-600 dark:text-gray-400 text-center mt-auto">
            Issues, suggestions, & pull requests are welcome!
          </span>
        </div>
      </div>
    </section>




















      {/* Features Section */}
      <h2 className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-200 text-center mb-16 mt-16">Features</h2>
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
