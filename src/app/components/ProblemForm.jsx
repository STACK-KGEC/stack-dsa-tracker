'use client';
import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

function getLast7Days() {
  // Get current UTC time, then add 5 hours 30 minutes for IST
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const istOffset = 5.5 * 60 * 60000; // 5 hours 30 mins in ms
  const todayIST = new Date(utc + istOffset);

  // Set time to 00:00:00 in IST
  todayIST.setHours(0, 0, 0, 0);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(todayIST);
    d.setDate(todayIST.getDate() - i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    days.push(`${yyyy}-${mm}-${dd}`);
  }
  return days;
}


export default function ProblemForm({ onAdded }) {
  const [bulk, setBulk] = useState(false);
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [link, setLink] = useState('');
  const [numOfPrbs, setNumOfPrbs] = useState(1);
  const [solvedDate, setSolvedDate] = useState(getLast7Days()[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        title: bulk ? 'Bulk Addition' : title,
        difficulty,
        problem_url: link,
        solved_date: solvedDate,
        num_of_prbs: bulk ? numOfPrbs : 1,
      }]);

    if (error) {
      alert('Error adding problem: ' + error.message);
    } else {
      setTitle('');
      setLink('');
      setDifficulty('Easy');
      setSolvedDate(getLast7Days()[0]);
      setNumOfPrbs(1);
      alert('Problem added successfully!');
      if (onAdded) onAdded();
    }
    setIsSubmitting(false);
  };
  console.log('minDate:', minDate, 'maxDate:', maxDate, 'solvedDate:', solvedDate);

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <input
          type="checkbox"
          id="bulk"
          checked={bulk}
          onChange={() => setBulk(!bulk)}
          className="w-5 h-5"
        />
        <label htmlFor="bulk" className="font-semibold text-lg text-gray-700 dark:text-gray-200">
          Bulk Add
        </label>
      </div>
      <input
        id="title"
        type="text"
        value={bulk ? 'Bulk Addition' : title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Problem Title"
        className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-lg"
        required
        disabled={bulk}
      />
      <div className="flex gap-4">
        <select
          id="difficulty"
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
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
      {bulk && (
        <input
          id="num_of_prbs"
          type="number"
          min={1}
          max={100}
          value={numOfPrbs}
          onChange={e => setNumOfPrbs(Number(e.target.value))}
          className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-lg"
          required
        />
      )}
      <input
        id="link"
        type="url"
        value={link}
        onChange={e => setLink(e.target.value)}
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
