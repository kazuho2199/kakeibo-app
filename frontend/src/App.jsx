import { useReceipts } from './hooks/useReceipts';
import ReceiptUploader from './components/ReceiptUploader';
import ReceiptList from './components/ReceiptList';
import CategoryPieChart from './components/CategoryPieChart';
import MonthlyBarChart from './components/MonthlyBarChart';
import './App.css';

// レシート読み込み家計簿アプリのルートコンポーネント
function App() {
  const { receipts, addReceiptItems, removeReceiptItem } = useReceipts();

  return (
    <div className="app">
      <h1>レシート読み込み家計簿</h1>

      <ReceiptUploader onAnalyzed={addReceiptItems} />

      <div className="charts">
        <CategoryPieChart receipts={receipts} />
        <MonthlyBarChart receipts={receipts} />
      </div>

      <ReceiptList receipts={receipts} onRemove={removeReceiptItem} />
    </div>
  );
}

export default App;
