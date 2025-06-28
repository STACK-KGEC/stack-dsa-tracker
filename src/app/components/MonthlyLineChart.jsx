'use client';
import dynamic from "next/dynamic";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/utils/supabaseClient";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

function getMonthDaysUTC() {
  // Get current UTC date
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth(); // 0-based
  // Days in current month
  const numDays = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const days = [];
  const labels = [];
  for (let d = 1; d <= numDays; d++) {
    days.push(`${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
    labels.push(d.toString());
  }
  // Today's UTC date as yyyy-mm-dd
  const todayUTC = `${year}-${String(month + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}`;
  return { days, labels, todayUTC };
}

function useIsDarkMode() {
  const [isDark, setIsDark] = useState(null);
  useEffect(() => {
    function checkDark() {
      if (typeof window !== 'undefined') {
        setIsDark(document.documentElement.classList.contains('dark'));
      }
    }
    checkDark();

    // Listen for changes to the class attribute (dark mode toggling)
    const observer = new MutationObserver(() => {
      checkDark();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return isDark;
}

const GRAPH_TYPES = [
  { key: "solved", label: "Problems Solved" },
  { key: "coins", label: "Coins Earned" },
];

export default function MonthlyLineChart() {
  const { days, labels, todayUTC } = useMemo(() => getMonthDaysUTC(), []);
  const [solvedData, setSolvedData] = useState([]);
  const [coinsData, setCoinsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("solved");
  const isDark = useIsDarkMode();

  // Index of today in days array
  const todayIdx = days.indexOf(todayUTC);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSolvedData([]);
        setCoinsData([]);
        setLoading(false);
        return;
      }
      // Fetch all problems for the user in the month
      const { data: solved, error } = await supabase
        .from("problems")
        .select("solved_date, num_of_prbs, coins")
        .eq("user_id", user.id)
        .gte("solved_date", days[0])
        .lte("solved_date", todayUTC);

      // Aggregate per day
      const solvedMap = {};
      const coinsMap = {};
      if (solved) {
        solved.forEach(row => {
          const date = row.solved_date;
          const num = Number(row.num_of_prbs) || 1;
          const coins = Number(row.coins) || 0;
          solvedMap[date] = (solvedMap[date] || 0) + num;
          coinsMap[date] = (coinsMap[date] || 0) + coins;
        });
      }
      // Only plot up to today; rest are null for a gap in the line
      setSolvedData(days.map((date, idx) => idx <= todayIdx ? (solvedMap[date] || 0) : null));
      setCoinsData(days.map((date, idx) => idx <= todayIdx ? (coinsMap[date] || 0) : null));
      setLoading(false);
    }
    fetchData();
    // eslint-disable-next-line
  }, [days, todayUTC]);

  // Chart series and options
  let series, colors;
  if (view === "solved") {
    series = [{ name: "Problems Solved", data: solvedData }];
    colors = [isDark ? "#60a5fa" : "#2563eb"];
  } else {
    series = [{ name: "Coins Earned", data: coinsData }];
    colors = [isDark ? "#fde68a" : "#f59e42"]; // yellow-200 / orange-400
  }

  const chartOptions = {
    chart: {
      id: "monthly-line-chart",
      toolbar: { show: false },
      background: "transparent",
      fontFamily: "inherit",
    },
    xaxis: {
      categories: labels,
      title: { text: "Date", style: { color: isDark ? "#a1a1aa" : "#6b7280" } },
      labels: {
        style: {
          colors: Array(labels.length).fill(isDark ? "#a1a1aa" : "#6b7280"),
          fontSize: "13px",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      forceNiceScale: true,
      title: {
        text: view === "solved" ? "Problems Solved" : "Coins Earned",
        style: { color: isDark ? "#a1a1aa" : "#6b7280" },
      },
      labels: {
        style: {
          colors: [isDark ? "#a1a1aa" : "#6b7280"],
          fontSize: "13px",
        },
      },
    },
    grid: {
      borderColor: isDark ? "#374151" : "#e5e7eb",
      strokeDashArray: 4,
      padding: { left: 10, right: 10, top: 10, bottom: 0 }, // fixed bottom padding to 0 to reduce gap
    },
    colors,
    stroke: {
      curve: "smooth",
      width: 3,
    },
    markers: {
      size: 5,
      colors,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 7 },
    },
    legend: { show: false },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: { formatter: val => view === "coins" ? `${val} coins` : `${val} solved` },
    },
    noData: {
      text: "No data this month",
      align: "center",
      verticalAlign: "middle",
      style: {
        color: isDark ? "#a1a1aa" : "#6b7280",
        fontSize: "16px",
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 my-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mx-2 my-4 gap-3">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Monthly Statistics
        </h2>
        <div className="flex gap-2">
          {GRAPH_TYPES.map(opt => (
            <button
              key={opt.key}
              className={`px-4 py-1.5 rounded-lg font-semibold text-sm transition
                ${view === opt.key
                  ? "bg-blue-500 text-white shadow dark:bg-blue-500"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-gray-600"}`}
              onClick={() => setView(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="w-full" style={{ minHeight: 280 }}>
        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading chart...</div>
        ) : (
          <Chart
            options={chartOptions}
            series={series}
            type="line"
            height={280}
          />
        )}
      </div>
    </div>
  );
}
