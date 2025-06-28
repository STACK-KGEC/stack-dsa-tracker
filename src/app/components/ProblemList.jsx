'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

export default function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProblems() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setProblems([]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('problems')
        .select('*')
        .eq('user_id', user.id)
        .order('solved_date', { ascending: false })
        .limit(5);

      setProblems(data || []);
      setLoading(false);
    }
    fetchProblems();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <span className="text-gray-500 dark:text-gray-400">Loading...</span>
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 text-center py-8">
        No problems solved yet.
      </div>
    );
  }

  function formatDateDDMMYYYY(dateStr) {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }


  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 rounded-xl shadow">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-indigo-700 dark:text-indigo-300 text-lg">Title</th>
            <th className="px-4 py-2 text-left text-indigo-700 dark:text-indigo-300 text-lg">Difficulty</th>
            <th className="px-4 py-2 text-left text-indigo-700 dark:text-indigo-300 text-lg">#</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <tr key={problem.id} className="border-t border-gray-200 dark:border-gray-700">
              <td className="px-4 py-2 font-semibold text-gray-900 dark:text-white">
                {problem.title}
              </td>
              <td className="px-4 py-2">
                <span className={
                  problem.difficulty === 'Easy'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded text-xs font-bold'
                    : problem.difficulty === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-1 rounded text-xs font-bold'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded text-xs font-bold'
                }>
                  {problem.difficulty}
                </span>
              </td>
              <td className="px-4 py-2 font-semibold text-gray-900 dark:text-white">
                {problem.num_of_prbs || 1}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  );
}
