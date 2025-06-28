'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { FaCheckCircle, FaTrash } from 'react-icons/fa';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function DifficultyBadge({ difficulty }) {
  let color = '';
  if (difficulty === 'Easy') color = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  else if (difficulty === 'Medium') color = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  else if (difficulty === 'Hard') color = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  return (
    <span className={`px-2 py-1 rounded text-xs font-bold ${color}`}>{difficulty}</span>
  );
}

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProblems();
  }, []);

  async function fetchProblems() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setProblems([]);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from('problems')
      .select('*') // Make sure 'coins' is included in your table schema
      .eq('user_id', user.id)
      .order('solved_date', { ascending: false });
    setProblems(data || []);
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this problem?')) return;
    await supabase.from('problems').delete().eq('id', id);
    fetchProblems();
  }

  if (loading) return <div className="text-center text-gray-500 dark:text-gray-400">Loading problems...</div>;
  if (problems.length === 0) return <div className="text-center text-gray-500 dark:text-gray-400">No problems added yet.</div>;

  return (
    <>
      <style>
      {`
        .scrollable-tbody {
          display: block;
          max-height: 24rem;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #a0aec0 #f7fafc;
          border-bottom-left-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
        }
        .scrollable-tbody::-webkit-scrollbar {
          width: 8px;
          border-bottom-right-radius: 0.75rem;
        }
        .scrollable-tbody::-webkit-scrollbar-thumb {
          background: #a0aec0;
          border-radius: 0.75rem;
        }
        .scrollable-tbody::-webkit-scrollbar-track {
          background: #f7fafc;
          border-bottom-right-radius: 0.75rem;
        }
        .scrollable-thead,
        .scrollable-tbody tr {
          display: table;
          width: 100%;
          table-layout: fixed;
        }
      `}
      </style>
      <div className="overflow-x-auto">
        <h1 className="text-4xl font-extrabold text-primary dark:text-primary-dark mb-2 text-center flex items-center justify-center gap-3">
          <FaCheckCircle /> Solved
        </h1>
        <p className="text-xs text-primary dark:text-primary-dark mb-8 text-center flex items-center justify-center">
          View & delete your solved problems.
        </p>
        <div className="rounded-xl shadow overflow-hidden">
          <table className="w-full min-w-full bg-white dark:bg-gray-800 text-center border-separate border-spacing-0">
            <thead className="scrollable-thead">
              <tr>
                <th className="px-4 py-3 text-primary dark:text-primary-dark rounded-tl-xl">Title</th>
                <th className="px-4 py-3 text-primary dark:text-primary-dark">Difficulty</th>
                <th className="px-4 py-3 text-primary dark:text-primary-dark">Date</th>
                <th className="px-4 py-3 text-primary dark:text-primary-dark">Coins</th>
                <th className="px-4 py-3 text-primary dark:text-primary-dark"># Solved</th>
                <th className="px-4 py-3 text-primary dark:text-primary-dark">Link</th>
                <th className="px-4 py-3 text-primary dark:text-primary-dark rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="scrollable-tbody">
              {problems.map((problem) => {
                const isBulk = (problem.num_of_prbs || 1) > 1;
                return (
                  <tr
                    key={problem.id}
                    className={
                      `border-t border-gray-200 dark:border-gray-700` +
                      (isBulk ? ' bg-blue-50 dark:bg-blue-900/40' : '')
                    }
                  >
                    <td className="px-4 py-4 font-semibold text-gray-900 dark:text-white">{problem.title}</td>
                    <td className="px-4 py-4"><DifficultyBadge difficulty={problem.difficulty} /></td>
                    <td className="px-4 py-4">{formatDate(problem.solved_date)}</td>
                    <td className="px-4 py-4 font-mono font-bold text-yellow-600 dark:text-yellow-300">{problem.coins}</td>
                    <td className="px-4 py-4 font-bold">
                      {problem.num_of_prbs || 1}
                      {isBulk && (
                        <span className="ml-1 text-xs text-blue-600 dark:text-blue-300">(Bulk)</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {problem.problem_url ? (
                        <a
                          href={problem.problem_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 dark:text-indigo-400 underline"
                        >
                          Link
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleDelete(problem.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
