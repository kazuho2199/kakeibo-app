import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { formatYen } from '../utils/formatCurrency';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartDataLabels);

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

  const options = {
    scales: {
      y: {
        ticks: {
          callback: (value) => formatYen(value),
        },
      },
    },
    plugins: {
      datalabels: {
        // 金額が0円の月はラベルを表示しない
        display: (context) => context.dataset.data[context.dataIndex] > 0,
        anchor: 'end',
        align: 'top',
        color: '#333',
        font: { weight: 'bold' },
        formatter: (value) => formatYen(value),
      },
    },
  };

  return (
    <div className="chart-card">
      <h2>月別支出</h2>
      <Bar data={data} options={options} />
    </div>
  );
}
