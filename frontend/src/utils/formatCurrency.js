// 金額を「¥xx,xxx」形式の文字列にする(円グラフ・棒グラフで共通のフォーマット)
export function formatYen(value) {
  return `¥${value.toLocaleString()}`;
}
