'use client';
import { FaExternalLinkAlt, FaUserCircle } from 'react-icons/fa';

export default function UserProfilePopup({ user, onClose }) {
  // If user is null or empty, show fallback
  const isEmpty =
    !user ||
    (Object.keys(user).length === 0) ||
    (!user.display_name && !user.bio && !user.codechef_url && !user.codeforces_url && !user.geekforgeeks_url && !user.github_url && !user.leetcode_url && !user.linkedin_url);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full p-8 relative flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-2xl font-bold"
          aria-label="Close popup"
        >
          &times;
        </button>
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-600 dark:text-gray-300 text-lg">
            <FaUserCircle className="text-5xl mb-2" />
            Nothing to show for this user
          </div>
        ) : (
          <>
            <FaUserCircle className="text-5xl text-indigo-400 dark:text-indigo-300 mb-2" />
            <h2 className="text-2xl font-bold text-primary dark:text-primary-dark mb-2 text-center">{user.display_name || 'Anonymous'}</h2>
            {user.bio && <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify whitespace-pre-wrap">{user.bio}</p>}
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {user.codechef_url && (
                <a
                  href={user.codechef_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 font-semibold shadow hover:bg-indigo-200 dark:hover:bg-indigo-700 transition"
                >
                  Codechef <FaExternalLinkAlt />
                </a>
              )}
              {user.codeforces_url && (
                <a
                  href={user.codeforces_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 font-semibold shadow hover:bg-indigo-200 dark:hover:bg-indigo-700 transition"
                >
                  Codeforces <FaExternalLinkAlt />
                </a>
              )}
              {user.geekforgeeks_url && (
                <a
                  href={user.geekforgeeks_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 font-semibold shadow hover:bg-indigo-200 dark:hover:bg-indigo-700 transition"
                >
                  GeeksforGeeks <FaExternalLinkAlt />
                </a>
              )}
              {user.github_url && (
                <a
                  href={user.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 font-semibold shadow hover:bg-indigo-200 dark:hover:bg-indigo-700 transition"
                >
                  GitHub <FaExternalLinkAlt />
                </a>
              )}
              {user.leetcode_url && (
                <a
                  href={user.leetcode_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 font-semibold shadow hover:bg-indigo-200 dark:hover:bg-indigo-700 transition"
                >
                  LeetCode <FaExternalLinkAlt />
                </a>
              )}
              {user.linkedin_url && (
                <a
                  href={user.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 font-semibold shadow hover:bg-indigo-200 dark:hover:bg-indigo-700 transition"
                >
                  LinkedIn <FaExternalLinkAlt />
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
