import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { CATEGORIES, CATEGORY_COLORS } from '../constants/categories';

ChartJS.register(ArcElement, Tooltip, Legend);

// カテゴリ別の支出割合を円グラフで表示するコンポーネント
export default function CategoryPieChart({ receipts }) {
  const totals = CATEGORIES.map((category) =>
    receipts
      .filter((item) => item.category === category)
      .reduce((sum, item) => sum + item.price, 0)
  );

  const data = {
    labels: CATEGORIES,
    datasets: [
      {
        data: totals,
        backgroundColor: CATEGORIES.map((category) => CATEGORY_COLORS[category]),
      },
    ],
  };

  return (
    <div className="chart-card">
      <h2>カテゴリ別支出</h2>
      <Pie data={data} />
    </div>
  );
}
