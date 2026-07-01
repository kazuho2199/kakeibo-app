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
  const addReceiptItems = (analyzed) => {
    const newItems = (analyzed.items || []).map((item) => ({
      id: crypto.randomUUID(),
      date: analyzed.date,
      name: item.name,
      price: Number(item.price) || 0,
      category: item.category,
    }));
    setReceipts((prev) => [...newItems, ...prev]);
  };

  const removeReceiptItem = (id) => {
    setReceipts((prev) => prev.filter((item) => item.id !== id));
  };

  return { receipts, addReceiptItems, removeReceiptItem };
}
