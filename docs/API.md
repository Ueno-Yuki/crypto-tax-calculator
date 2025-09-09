# API ドキュメント

## 概要

この API は仮想通貨の取引データを管理し、税額計算を行うためのエンドポイントを提供します。

## ベース URL

```
http://localhost:8080/api
```

## 認証

現在は認証機能を実装していません。セッションベースでデータを管理します。

## エンドポイント

### ヘルスチェック

#### `GET /health`

API の動作状況を確認します。

**レスポンス例:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00",
  "service": "crypto-tax-calculator",
  "version": "1.0.0"
}
```

### 取引管理

#### `GET /transactions`

セッションに紐づく取引一覧を取得します。

**レスポンス例:**
```json
[
  {
    "id": 1,
    "type": "BUY",
    "symbol": "BTC",
    "amount": 0.1,
    "priceJpy": 5000000,
    "transactionDate": "2024-01-15T10:00:00",
    "exchange": "Binance",
    "notes": "初回購入",
    "sessionId": "SESSION123",
    "createdAt": "2024-01-15T10:00:00"
  }
]
```

#### `POST /transactions`

新しい取引を追加します。

**リクエストボディ:**
```json
{
  "type": "BUY",
  "symbol": "BTC",
  "amount": 0.1,
  "priceJpy": 5000000,
  "transactionDate": "2024-01-15T10:00:00",
  "exchange": "Binance",
  "notes": "初回購入"
}
```

**フィールド説明:**
- `type` (必須): 取引種別 ("BUY", "SELL", "SEND", "RECEIVE")
- `symbol` (必須): 仮想通貨シンボル (例: "BTC", "ETH")
- `amount` (必須): 数量 (正の数値)
- `priceJpy`: 1単位あたりの価格 (円)
- `transactionDate` (必須): 取引日時 (ISO 8601 形式)
- `exchange`: 取引所名
- `notes`: メモ

#### `DELETE /transactions/{id}`

指定したIDの取引を削除します。

**パラメータ:**
- `id`: 取引ID

**レスポンス:** 204 No Content

### 税額計算

#### `POST /transactions/calculate-tax`

現在のセッションの取引データから税額を計算します。

**レスポンス例:**
```json
{
  "totalGainLoss": 150000,
  "totalPurchaseAmount": 500000,
  "totalSaleAmount": 650000,
  "transactionSummaries": [
    {
      "symbol": "BTC",
      "totalAmount": 0.05,
      "totalPurchasePrice": 250000,
      "totalSalePrice": 300000,
      "gainLoss": 50000
    }
  ],
  "calculatedAt": "2024-01-15T11:00:00",
  "sessionId": "SESSION123"
}
```

#### `DELETE /transactions/clear`

セッションに紐づく全ての取引データを削除します。

**レスポンス例:**
```json
{
  "message": "Session data cleared successfully"
}
```

## エラーハンドリング

### HTTP ステータスコード

- `200 OK`: 正常処理
- `201 Created`: リソース作成成功
- `204 No Content`: 削除成功
- `400 Bad Request`: リクエストエラー
- `404 Not Found`: リソースが見つからない
- `500 Internal Server Error`: サーバーエラー

### エラーレスポンス形式

```json
{
  "timestamp": "2024-01-15T11:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/transactions"
}
```

## 税額計算ロジック

### 移動平均法

このアプリケーションは日本の税法に準拠した移動平均法を使用して税額を計算します。

1. **購入時**: 保有数量と総コストを更新
2. **売却時**: 
   - 平均単価 = 総コスト ÷ 保有数量
   - 売却コスト = 売却数量 × 平均単価
   - 損益 = 売却金額 - 売却コスト
   - 保有数量と総コストを売却分だけ減算

### 注意事項

- このアプリケーションは学習目的で作成されています
- 実際の税務申告には専門家にご相談ください
- データはセッション終了時に自動削除されます