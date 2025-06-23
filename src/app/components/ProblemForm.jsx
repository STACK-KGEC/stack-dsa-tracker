'use client';
import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

function getLast7Days() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    // Always use local time for YYYY-MM-DD
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    days.push(`${yyyy}-${mm}-${dd}`);
  }
  return days;
}


function formatDate(date) {
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}
export default function ProblemForm({ onAdded }) {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [link, setLink] = useState('');
  const [solvedDate, setSolvedDate] = useState(getLast7Days()[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calendar logic: only allow selecting today or up to 6 days before
  const minDate = getLast7Days()[6];
  const maxDate = getLast7Days()[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('problems')
      .insert([{
        user_id: user.id,
        title,
        difficulty,
        problem_url: link,
        solved_date: solvedDate
      }]);

    if (error) {
      alert('Error adding problem: ' + error.message);
    } else {
      setTitle('');
      setLink('');
      setDifficulty('Easy');
      setSolvedDate(getLast7Days()[0]);
      alert('Problem added successfully!');
      if (onAdded) onAdded();
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6 flex flex-col gap-4">
      <input
        id="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Problem Title"
        className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-lg"
        required
      />
      <div className="flex gap-4">
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-lg appearance-none"
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <input
          id="solvedDate"
          type="date"
          value={solvedDate}
          min={minDate}
          max={maxDate}
          onChange={e => setSolvedDate(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-lg"
        />
      </div>
      <input
        id="link"
        type="url"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Problem Link (optional)"
        className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-lg"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary dark:bg-primary-dark text-white font-bold py-3 rounded-xl transition text-lg"
      >
        {isSubmitting ? 'Adding...' : 'Add Problem'}
      </button>
    </form>
  );
}
