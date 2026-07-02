import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { CATEGORIES, CATEGORY_COLORS } from '../constants/categories';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

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

  const options = {
    plugins: {
      datalabels: {
        // 金額が0円のカテゴリはラベルを表示しない
        display: (context) => context.dataset.data[context.dataIndex] > 0,
        color: '#fff',
        font: { weight: 'bold' },
        formatter: (value, context) =>
          `${context.chart.data.labels[context.dataIndex]}\n¥${value.toLocaleString()}`,
      },
    },
  };

  return (
    <div className="chart-card">
      <h2>カテゴリ別支出</h2>
      <Pie data={data} options={options} />
    </div>
  );
}
