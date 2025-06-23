'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import {
  FaTrophy,
  FaStar,
  FaTasks,
  FaHistory,
  FaMedal,
  FaUserFriends,
} from 'react-icons/fa';
import UserProfilePopup from '@/components/UserProfilePopup';

const leaderboardViews = {
  alltime: { label: 'All Time', current: 'leaderboard_alltime_with_names' },
  daily: {
    label: 'Daily',
    current: 'leaderboard_daily_with_names',
    previous: 'leaderboard_previous_day_with_names',
    currentLabel: 'Today',
    previousLabel: 'Yesterday',
  },
  weekly: {
    label: 'Weekly',
    current: 'leaderboard_weekly_with_names',
    previous: 'leaderboard_previous_week_with_names',
    currentLabel: 'This Week',
    previousLabel: 'Last Week',
  },
  monthly: {
    label: 'Monthly',
    current: 'leaderboard_monthly_with_names',
    previous: 'leaderboard_previous_month_with_names',
    currentLabel: 'This Month',
    previousLabel: 'Last Month',
  },
};

export default function LeaderboardPage() {
  const [period, setPeriod] = useState('alltime');
  const [showPrevious, setShowPrevious] = useState(false);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    async function fetchLeaders() {
      setLoading(true);
      const viewName =
        showPrevious && leaderboardViews[period].previous
          ? leaderboardViews[period].previous
          : leaderboardViews[period].current;

      const { data } = await supabase
        .from(viewName)
        .select('*')
        .order('coins', { ascending: false });

      setLeaders(data ? data.slice(0, 20) : []);

      // Fetch current user rank
      const { data: allData } = await supabase
        .from(viewName)
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
  }, [period, showPrevious]);

  // Fetch profile for popup
  async function fetchUserProfile(user_id) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user_id)
      .single();
    if (error || !data) {
      setSelectedUser({});
      return;
    }
    setSelectedUser(data);
  }

  async function handleUserClick(user_id) {
    await fetchUserProfile(user_id);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold text-primary dark:text-primary-dark mb-8 text-center flex items-center justify-center gap-3">
        <FaTrophy /> Leaderboard
      </h1>

      {/* Period Tabs */}
      <div className="flex justify-center mb-6 gap-4 flex-wrap">
        {Object.entries(leaderboardViews).map(([key, value]) => (
          <button
            key={key}
            onClick={() => {
              setPeriod(key);
              setShowPrevious(false);
            }}
            className={`px-6 py-2 rounded-full font-bold text-lg transition
              ${period === key
                ? 'bg-primary dark:bg-primary-dark text-white'
                : 'bg-primary/10 dark:bg-primary-dark/20 text-primary dark:text-primary-dark hover:bg-primary/20 dark:hover:bg-primary-dark/30'
              }`
            }
          >
            {value.label}
          </button>
        ))}
      </div>

      {/* Current/Previous Toggle */}
      {period !== 'alltime' && (
        <div className="flex justify-center mb-8 gap-4">
          <button
            onClick={() => setShowPrevious(false)}
            className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2
              ${!showPrevious
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-200 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
              }`
            }
          >
            <FaTrophy /> {leaderboardViews[period].currentLabel}
          </button>
          <button
            onClick={() => setShowPrevious(true)}
            className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2
              ${showPrevious
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-200 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
              }`
            }
          >
            <FaHistory /> {leaderboardViews[period].previousLabel}
          </button>
        </div>
      )}

      {/* Self Rank Card */}
      {userRank && (
        <div className="max-w-2xl mx-auto bg-yellow-100 dark:bg-yellow-900 rounded-2xl shadow p-6 mb-8 flex items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <FaMedal className="text-yellow-600 dark:text-yellow-400 text-2xl" />
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
          <div className="flex items-center gap-2">
            <FaTasks className="text-green-600 dark:text-green-200 text-2xl" />
            <span className="font-bold text-green-700 dark:text-green-200 text-xl">
              {userRank.problems_solved} Problems
            </span>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8">
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-2 px-4 text-primary dark:text-primary-dark text-lg">Rank</th>
                <th className="text-left py-2 px-4 text-primary dark:text-primary-dark text-lg">
                  <span className="flex items-center gap-2">
                    <FaUserFriends className="text-indigo-500" /> Name
                  </span>
                </th>
                <th className="text-left py-2 px-4 text-primary dark:text-primary-dark text-lg">
                  <span className="flex items-center gap-2">
                    <FaStar className="text-yellow-500" /> Coins
                  </span>
                </th>
                <th className="text-left py-2 px-4 text-primary dark:text-primary-dark text-lg">
                  <span className="flex items-center gap-2">
                    <FaTasks className="text-green-600" /> Problems
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((row, idx) => {
                let lastCoins = null;
                let lastRank = 0;
                if (idx === 0 || row.coins !== leaders[idx - 1].coins) {
                  lastRank = idx + 1;
                } else {
                  lastRank = leaders[idx - 1].rank;
                }
                row.rank = lastRank;
                return (
                  <tr key={row.user_id || row.id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="py-2 px-4 font-bold">{row.rank}</td>
                    <td
                      className="py-2 px-4 cursor-pointer text-blue-600 dark:text-blue-300 hover:underline"
                      onClick={() => handleUserClick(row.user_id)}
                      title="View Profile"
                    >
                      {row.display_name || 'Anonymous'}
                    </td>
                    <td className="py-2 px-4">{row.coins}</td>
                    <td className="py-2 px-4">{row.problems_solved}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {/* User Profile Popup */}
      {selectedUser !== null && (
        <UserProfilePopup user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}
