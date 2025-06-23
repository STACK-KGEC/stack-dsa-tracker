'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { FaTrophy, FaUser, FaStar } from 'react-icons/fa';

const leaderboardViews = {
  alltime: 'leaderboard_alltime_with_names',
  daily: 'leaderboard_daily_with_names',
  weekly: 'leaderboard_weekly_with_names',
  monthly: 'leaderboard_monthly_with_names',
};

export default function LeaderboardPage() {
  const [period, setPeriod] = useState('alltime');
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    async function fetchLeaders() {
      setLoading(true);
      const { data } = await supabase
        .from(leaderboardViews[period])
        .select('*')
        .order('coins', { ascending: false });
      setLeaders(data ? data.slice(0, 20) : []);

      // Fetch current user rank
      const { data: allData } = await supabase
        .from(leaderboardViews[period])
        .select('*')
        .order('coins', { ascending: false });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !allData || !Array.isArray(allData)) {
        setUserRank(null);
        setLoading(false);
        return;
      }

      let lastCoins = null;
      let lastRank = 0;
      let rank = null;
      allData.forEach((row, idx) => {
        if (row.coins !== lastCoins) {
          lastRank = idx + 1;
          lastCoins = row.coins;
        }
        if (row.user_id === user.id) {
          rank = { ...row, rank: lastRank };
        }
      });
      setUserRank(rank);
      setLoading(false);
    }
    fetchLeaders();
  }, [period]);

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-primary dark:text-primary-dark mb-8 text-center flex items-center justify-center gap-3">
        <FaTrophy /> Leaderboard
      </h1>
      <div className="flex justify-center mb-8 gap-4 flex-wrap">
        {Object.keys(leaderboardViews).map((key) => (
          <button
            key={key}
            onClick={() => setPeriod(key)}
            className={`px-6 py-2 rounded-full font-bold text-lg transition
              ${period === key
                ? 'bg-primary dark:bg-primary-dark text-white'
                : 'bg-primary/10 dark:bg-primary-dark/20 text-primary dark:text-primary-dark hover:bg-primary/20 dark:hover:bg-primary-dark/30'
              }`
            }
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {userRank && (
        <div className="max-w-2xl mx-auto bg-yellow-100 dark:bg-yellow-900 rounded-2xl shadow p-6 mb-6 flex items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <FaTrophy className="text-yellow-600 dark:text-yellow-400 text-2xl" />
            <span className="font-bold text-yellow-700 dark:text-yellow-300 text-xl">
              #{userRank.rank}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaStar className="text-yellow-500 dark:text-yellow-200 text-2xl" />
            <span className="font-bold text-yellow-700 dark:text-yellow-300 text-xl">
              {userRank.coins} Coins
            </span>
          </div>
        </div>
      )}


      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow p-8">
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-2 px-4 text-primary dark:text-primary-dark text-lg">Rank</th>
                <th className="text-left py-2 px-4 text-primary dark:text-primary-dark text-lg">Name</th>
                <th className="text-left py-2 px-4 text-primary dark:text-primary-dark text-lg">Coins</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((row, idx) => {
                let lastCoins = null;
                let lastRank = 0;
                // Calculate rank with ties
                if (idx === 0 || row.coins !== leaders[idx - 1].coins) {
                  lastRank = idx + 1;
                } else {
                  lastRank = leaders[idx - 1].rank;
                }
                row.rank = lastRank;
                return (
                  <tr key={row.user_id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="py-2 px-4 font-bold">{row.rank}</td>
                    <td className="py-2 px-4">{row.display_name || 'Anonymous'}</td>
                    <td className="py-2 px-4">{row.coins}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
