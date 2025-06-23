'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import ProblemForm from '@/components/ProblemForm';
import ProblemList from '@/components/ProblemList';
import StatsCard from '@/components/StatsCard';
import { FaCheckCircle, FaStar, FaBolt, FaFire, FaLeaf, FaCalendarAlt } from 'react-icons/fa';

export default function Dashboard() {
  const [stats, setStats] = useState({ solved: 0, rank: '-', coins: 0, easy: 0, medium: 0, hard: 0 });
  const [allRanks, setAllRanks] = useState([]);

  async function fetchStats() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch all problems for the user, including num_of_prbs
    const { data: problems } = await supabase
      .from('problems')
      .select('difficulty, num_of_prbs')
      .eq('user_id', user.id);

    let easy = 0, medium = 0, hard = 0, solved = 0, coins = 0;
    if (problems) {
      problems.forEach(p => {
        const n = p.num_of_prbs || 1;
        solved += n;
        if (p.difficulty === 'Easy') {
          easy += n;
          coins += 10 * n;
        } else if (p.difficulty === 'Medium') {
          medium += n;
          coins += 20 * n;
        } else if (p.difficulty === 'Hard') {
          hard += n;
          coins += 30 * n;
        }
      });
    }

    // Fetch leaderboard alltime to calculate rank and all ranks
    const { data: leaderboard } = await supabase
      .from('leaderboard_alltime_with_names')
      .select('*')
      .order('coins', { ascending: false });

    let rank = '-';
    let ranks = [];
    if (leaderboard && Array.isArray(leaderboard)) {
      let currentRank = 1;
      let lastCoins = null;
      let userRank = null;
      leaderboard.forEach((entry, index) => {
        if (lastCoins !== entry.coins) {
          currentRank = index + 1;
          lastCoins = entry.coins;
        }
        ranks.push({ ...entry, rank: currentRank });
        if (entry.user_id === user.id) {
          userRank = currentRank;
        }
      });
      rank = userRank ? `#${userRank}` : '-';
    }

    setStats({ solved, rank, coins, easy, medium, hard });
    setAllRanks(ranks);
  }

  useEffect(() => {
    fetchStats();
  }, []);

  // To refresh stats after adding a problem
  const handleProblemAdded = () => fetchStats();

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-primary dark:text-primary-dark mb-8 text-center flex items-center justify-center gap-3">
        <FaStar /> Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
        <StatsCard
          title="Solved"
          value={stats.solved}
          icon={<FaCheckCircle className="text-blue-500" />}
          color="bg-white dark:bg-gray-700"
          textColor="text-blue-900 dark:text-blue-200"
        />
        <StatsCard
          title="Coins"
          value={stats.coins}
          icon={<FaStar className="text-yellow-400" />}
          color="bg-yellow-100 dark:bg-yellow-900"
          textColor="text-yellow-800 dark:text-yellow-200"
        />
        <StatsCard
          title="Easy"
          value={stats.easy}
          icon={<FaLeaf className="text-green-500" />}
          color="bg-green-100 dark:bg-green-900"
          textColor="text-green-800 dark:text-green-200"
        />
        <StatsCard
          title="Medium"
          value={stats.medium}
          icon={<FaBolt className="text-yellow-500" />}
          color="bg-yellow-100 dark:bg-yellow-900"
          textColor="text-yellow-800 dark:text-yellow-200"
        />
        <StatsCard
          title="Hard"
          value={stats.hard}
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
            <FaCalendarAlt /> Recent Problems
          </h2>
          <ProblemList />
        </div>
      </div>
    </div>
  );
}
