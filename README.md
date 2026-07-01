# レシート読み込み家計簿

レシート画像をアップロードするとClaude APIが内容を自動読み取りし、商品名・金額・日付・カテゴリを一覧表示、Chart.jsでカテゴリ別/月別に集計する家計簿Webアプリです。

## 構成

- `frontend/` : React (Vite) 製のUI
- `backend/` : Node.js (Express) 製のAPIサーバー。Claude APIの呼び出しはここでのみ行う

## セットアップ

### 1. バックエンド

```bash
cd backend
npm install
cp .env.example .env
# .env を開き ANTHROPIC_API_KEY に自分のAPIキーを設定する
npm run dev
```

### 2. フロントエンド

```bash
cd frontend
npm install
npm run dev
```

ブラウザで表示されたURL（通常 http://localhost:5173 ）にアクセスしてください。

## 使い方

1. 「レシート画像をアップロード」からレシートの写真を選択する
2. Claude APIが商品名・金額・日付・カテゴリを自動抽出し、一覧とグラフに反映される
3. データはブラウザのローカルストレージに保存され、リロードしても消えない
