'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import ProblemForm from '@/components/ProblemForm';
import ProblemList from '@/components/ProblemList';
import StatsCard from '@/components/StatsCard';
import { FaCheckCircle, FaStar, FaBolt, FaFire, FaLeaf, FaCalendarAlt } from 'react-icons/fa';

const PERIODS = [
  { key: 'alltime', label: 'All Time', view: 'leaderboard_alltime_with_names' },
  { key: 'monthly', label: 'This Month', view: 'leaderboard_monthly_with_names' },
  { key: 'weekly', label: 'This Week', view: 'leaderboard_weekly_with_names' },
  { key: 'daily', label: 'Today', view: 'leaderboard_daily_with_names' },
];

export default function Dashboard() {
  const [stats, setStats] = useState({ solved: 0, rank: '-', coins: 0, easy: 0, medium: 0, hard: 0 });
  const [selectedPeriod, setSelectedPeriod] = useState('alltime');
  const [loading, setLoading] = useState(true);

  // On mount, check localStorage for saved period
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('dashboardPeriod');
      if (stored && stored !== selectedPeriod) {
        setSelectedPeriod(stored);
      }
    }
  }, []);

  // Fetch stats whenever selectedPeriod changes
  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod]);

  async function fetchStats() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const periodObj = PERIODS.find(p => p.key === selectedPeriod) || PERIODS[0];

    // Fetch user stats from the selected leaderboard view
    const { data: [userStats] } = await supabase
      .from(periodObj.view)
      .select('problems_solved, coins, user_id')
      .eq('user_id', user.id);

    // Fetch per-difficulty stats using RPC
    let easy = 0, medium = 0, hard = 0;
    let startDate, endDate;
    const today = new Date();

    if (selectedPeriod === 'daily') {
      startDate = endDate = today.toISOString().slice(0, 10);
    } else if (selectedPeriod === 'weekly') {
      const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1;
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - dayOfWeek);
      startDate = weekStart.toISOString().slice(0, 10);
      endDate = today.toISOString().slice(0, 10);
    } else if (selectedPeriod === 'monthly') {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
      endDate = today.toISOString().slice(0, 10);
    } else {
      startDate = '2025-01-01';
      endDate = today.toISOString().slice(0, 10);
    }

    const { data: difficultyStats } = await supabase
      .rpc('user_difficulty_stats', {
        uid: user.id,
        start_date: startDate,
        end_date: endDate
      });

    if (difficultyStats) {
      difficultyStats.forEach(d => {
        if (d.difficulty === 'Easy') easy = Number(d.count);
        if (d.difficulty === 'Medium') medium = Number(d.count);
        if (d.difficulty === 'Hard') hard = Number(d.count);
      });
    }

    // Fetch leaderboard for the selected period to calculate rank
    const { data: leaderboard } = await supabase
      .from(periodObj.view)
      .select('user_id, coins')
      .order('coins', { ascending: false });

    let rank = '-';
    if (leaderboard && Array.isArray(leaderboard)) {
      let currentRank = 1;
      let lastCoins = null;
      let userRank = null;
      leaderboard.forEach((entry, index) => {
        if (lastCoins !== entry.coins) {
          currentRank = index + 1;
          lastCoins = entry.coins;
        }
        if (entry.user_id === user.id) {
          userRank = currentRank;
        }
      });
      rank = userRank ? `#${userRank}` : '-';
    }

    setStats({
      solved: userStats?.problems_solved ?? 0,
      rank,
      coins: userStats?.coins ?? 0,
      easy,
      medium,
      hard
    });
    setLoading(false);
  }

  // Save selected period to localStorage
  function handlePeriodChange(key) {
    setSelectedPeriod(key);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboardPeriod', key);
    }
  }

  // To refresh stats after adding a problem
  const handleProblemAdded = () => fetchStats();

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-primary dark:text-primary-dark mb-8 text-center flex items-center justify-center gap-3">
        <FaStar /> Dashboard
      </h1>

      {/* Period selection row */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <span className="font-semibold text-lg text-gray-700 dark:text-gray-200">Showing for:</span>
        {PERIODS.map(period => (
          <button
            key={period.key}
            onClick={() => handlePeriodChange(period.key)}
            className={`px-4 py-2 rounded-full font-semibold transition 
              ${selectedPeriod === period.key
                ? 'bg-blue-500 text-white shadow'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900'}`}
          >
            {period.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
        <StatsCard
          title="Solved"
          value={loading ? '-' : stats.solved}
          icon={<FaCheckCircle className="text-blue-500" />}
          color="bg-white dark:bg-gray-700"
          textColor="text-blue-900 dark:text-blue-200"
        />
        <StatsCard
          title="Coins"
          value={loading ? '-' : stats.coins}
          icon={<FaStar className="text-yellow-400" />}
          color="bg-yellow-100 dark:bg-yellow-900"
          textColor="text-yellow-800 dark:text-yellow-200"
        />
        <StatsCard
          title="Easy"
          value={loading ? '-' : stats.easy}
          icon={<FaLeaf className="text-green-500" />}
          color="bg-green-100 dark:bg-green-900"
          textColor="text-green-800 dark:text-green-200"
        />
        <StatsCard
          title="Medium"
          value={loading ? '-' : stats.medium}
          icon={<FaBolt className="text-yellow-500" />}
          color="bg-yellow-100 dark:bg-yellow-900"
          textColor="text-yellow-800 dark:text-yellow-200"
        />
        <StatsCard
          title="Hard"
          value={loading ? '-' : stats.hard}
          icon={<FaFire className="text-red-500" />}
          color="bg-red-100 dark:bg-red-900"
          textColor="text-red-800 dark:text-red-200"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-primary dark:text-primary-dark flex items-center gap-2">
            <FaStar /> Add Solved Problem
          </h2>
          <ProblemForm onAdded={handleProblemAdded} />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4 text-primary dark:text-primary-dark flex items-center gap-2">
            <FaCalendarAlt /> Recently Solved
          </h2>
          <ProblemList />
        </div>
      </div>
    </div>
  );
}
