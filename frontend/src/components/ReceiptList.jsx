// 読み取ったレシート明細(商品名・金額・日付・カテゴリ)の一覧を表示するコンポーネント
export default function ReceiptList({ receipts, onRemove }) {
  if (receipts.length === 0) {
    return <p className="empty-message">まだデータがありません。レシートをアップロードしてください。</p>;
  }

  return (
    <table className="receipt-table">
      <thead>
        <tr>
          <th>日付</th>
          <th>商品名</th>
          <th>カテゴリ</th>
          <th>金額</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {receipts.map((item) => (
          <tr key={item.id}>
            <td>{item.date}</td>
            <td>{item.name}</td>
            <td>{item.category}</td>
            <td>¥{item.price.toLocaleString()}</td>
            <td>
              <button className="remove-button" onClick={() => onRemove(item.id)}>
                削除
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
