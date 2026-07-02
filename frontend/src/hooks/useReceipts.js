import { useEffect, useState } from 'react';

const STORAGE_KEY = 'kakeibo-receipts';

// レシートの明細データをローカルストレージと同期しながら管理するフック
// ページをリロードしてもデータが消えないようにする
export function useReceipts() {
  const [receipts, setReceipts] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(receipts));
  }, [receipts]);

  // Claude APIの解析結果(1枚のレシート分)を明細単位に分解して追加する
  // 検証で見つかった問題は警告メッセージの配列として返す(追加自体はブロックしない)
  const addReceiptItems = (analyzed) => {
    const items = analyzed.items || [];
    const warnings = validateReceipt(receipts, analyzed.date, items);

    const newItems = items.map((item) => ({
      id: crypto.randomUUID(),
      date: analyzed.date,
      name: item.name,
      price: Number(item.price) || 0,
      category: item.category,
    }));
    setReceipts((prev) => [...newItems, ...prev]);

    return warnings;
  };

  const removeReceiptItem = (id) => {
    setReceipts((prev) => prev.filter((item) => item.id !== id));
  };

  return { receipts, addReceiptItems, removeReceiptItem };
}

// 金額が負の値の項目や、同一日付・同一合計金額の重複登録を検出して警告文にする
function validateReceipt(existingReceipts, date, items) {
  const warnings = [];

  const negativeItems = items.filter((item) => Number(item.price) < 0);
  if (negativeItems.length > 0) {
    warnings.push(
      `金額が負の値になっている項目があります: ${negativeItems
        .map((item) => item.name)
        .join('、')}`
    );
  }

  const totalAmount = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  const totalsByDate = existingReceipts.reduce((totals, item) => {
    totals[item.date] = (totals[item.date] || 0) + item.price;
    return totals;
  }, {});

  if (date in totalsByDate && totalsByDate[date] === totalAmount) {
    warnings.push(
      `同じ日付(${date})・合計金額(¥${totalAmount.toLocaleString()})のレシートが既に登録されています`
    );
  }

  return warnings;
}
