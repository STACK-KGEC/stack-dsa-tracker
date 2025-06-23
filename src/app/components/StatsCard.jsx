export default function StatsCard({ title, value, icon, color = 'bg-white dark:bg-gray-700', textColor = 'text-gray-900 dark:text-white' }) {
  return (
    <div className={`rounded-2xl shadow p-8 flex flex-col gap-4 items-center justify-center ${color}`}>
      <div className="mb-2 text-4xl">{icon}</div>
      <div className={`text-4xl font-extrabold mb-1 ${textColor}`}>{value}</div>
      <div className={`text-xl font-bold ${textColor}`}>{title}</div>
    </div>
  );
}