import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// 月別の支出合計を棒グラフで表示するコンポーネント
export default function MonthlyBarChart({ receipts }) {
  const monthlyTotals = {};

  receipts.forEach((item) => {
    const month = item.date?.slice(0, 7); // "YYYY-MM" を取り出す
    if (!month) return;
    monthlyTotals[month] = (monthlyTotals[month] || 0) + item.price;
  });

  const months = Object.keys(monthlyTotals).sort();

  const data = {
    labels: months,
    datasets: [
      {
        label: '月別支出合計',
        data: months.map((month) => monthlyTotals[month]),
        backgroundColor: '#36A2EB',
      },
    ],
  };

  return (
    <div className="chart-card">
      <h2>月別支出</h2>
      <Bar data={data} />
    </div>
  );
}
