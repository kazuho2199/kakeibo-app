# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

レシート画像をアップロードするとClaude APIで内容を自動読み取りし、商品名・金額・日付・カテゴリを一覧表示してChart.jsでカテゴリ別/月別に集計する家計簿Webアプリ。`frontend`（React/Vite）と `backend`（Node.js/Express）の2プロジェクト構成。

## よく使うコマンド

### バックエンド (`backend/`)
```
cd backend
npm install
cp .env.example .env   # ANTHROPIC_API_KEYを設定する
npm run dev             # node --watch server.js でホットリロード起動 (http://localhost:3001)
npm start                # 通常起動
```

### フロントエンド (`frontend/`)
```
cd frontend
npm install
npm run dev      # Vite開発サーバー起動
npm run build    # 本番ビルド
npm run lint     # ESLint
```

両方を同時に起動しないとレシート解析機能は動作しない（フロントエンドはbackendのAPIを呼び出す）。

## アーキテクチャ

- **フロントエンド → バックエンド → Claude API** の順で通信し、Claude APIキーはバックエンド (`backend/server.js`) のみが保持する。ブラウザから直接Claude APIを呼び出さない。
- `frontend/src/components/ReceiptUploader.jsx` が画像をBase64化し、`POST /api/analyze-receipt` に送信する。
- `backend/server.js` がAnthropic SDK (`claude-haiku-4-5-20251001`) にレシート画像を渡し、商品名・金額・日付・カテゴリをJSONで抽出して返す。カテゴリ一覧はここで定義され、フロントエンドの `frontend/src/constants/categories.js` と一致させる必要がある。
- 解析結果は `frontend/src/hooks/useReceipts.js` が明細単位に分解し、`localStorage`（キー: `kakeibo-receipts`）に永続化する。リロードしてもデータは消えない。
- `CategoryPieChart.jsx` / `MonthlyBarChart.jsx` が `receipts` 配列を集計してChart.jsで円グラフ・棒グラフを描画する。

## Git運用ルール

- **コードに変更を加えたら、その都度コミットしてGitHubにプッシュすること。** 変更を作業ツリーに置いたままにせず、都度リモートに反映する。
- コミットは変更内容ごとに分け、目的が分かるコミットメッセージを付けること。
- push前に必ず現在のブランチとリモートの状態を確認すること。
