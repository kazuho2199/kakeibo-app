// レシート画像をClaude APIで解析するためのバックエンドサーバー
// ブラウザから直接Claude APIキーを扱わせず、必ずこのサーバーを経由させる
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 3001;

// レシート画像はBase64で送られてくるためボディサイズの上限を拡張しておく
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// 自動分類に使うカテゴリ一覧(フロントエンドの表示・集計と合わせる)
const CATEGORIES = ['食費', '外食', '日用品', '交通', '娯楽', '医療', 'その他'];

app.post('/api/analyze-receipt', async (req, res) => {
  try {
    const { imageBase64, mediaType } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: '画像データが送信されていません' });
    }

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType || 'image/jpeg',
                data: imageBase64,
              },
            },
            {
              type: 'text',
              // JSON以外の余計な文章を出させないよう厳密にフォーマットを指定する
              text: `このレシート画像を読み取り、以下のJSON形式のみで回答してください。前後に説明文やコードブロックの記号は付けないでください。

{
  "date": "YYYY-MM-DD形式のレシートの日付(読み取れない場合は今日の日付)",
  "items": [
    {
      "name": "商品名",
      "price": 金額(数値のみ、税込みの支払金額),
      "category": "${CATEGORIES.join(' か ')} のいずれか1つ"
    }
  ]
}`,
            },
          ],
        },
      ],
    });

    const textContent = message.content.find((c) => c.type === 'text')?.text ?? '';

    // Claudeの応答からJSON部分のみを抜き出してパースする
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Claudeの応答からJSONを抽出できませんでした');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // カテゴリが未知の値だった場合は「その他」に丸める
    parsed.items = (parsed.items || []).map((item) => ({
      ...item,
      category: CATEGORIES.includes(item.category) ? item.category : 'その他',
    }));

    res.json(parsed);
  } catch (error) {
    console.error('レシート解析エラー:', error);
    res.status(500).json({ error: 'レシートの解析に失敗しました' });
  }
});

app.listen(PORT, () => {
  console.log(`サーバーが起動しました: http://localhost:${PORT}`);
});
