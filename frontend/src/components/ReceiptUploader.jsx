import { useState } from 'react';

// バックエンドのAPIエンドポイント(未設定時はローカル開発用のデフォルトを使う)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// レシート画像をアップロードし、バックエンド経由でClaude APIに解析させるコンポーネント
export default function ReceiptUploader({ onAnalyzed }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const { base64, mediaType } = await fileToBase64(file);

      const response = await fetch(`${API_URL}/api/analyze-receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mediaType }),
      });

      if (!response.ok) {
        throw new Error('サーバーとの通信に失敗しました');
      }

      const data = await response.json();
      onAnalyzed(data);
    } catch (err) {
      console.error(err);
      setError('レシートの読み取りに失敗しました。画像を確認して再度お試しください。');
    } finally {
      setLoading(false);
      // 同じファイルを連続して選択できるように入力値をリセットする
      event.target.value = '';
    }
  };

  return (
    <div className="uploader">
      <label className="upload-button">
        {loading ? '解析中…' : 'レシート画像をアップロード'}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
          hidden
        />
      </label>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

// 画像ファイルをClaude APIに渡せるBase64文字列に変換する
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // data:image/png;base64,xxxx... の先頭部分を取り除く
      const base64 = reader.result.split(',')[1];
      resolve({ base64, mediaType: file.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
