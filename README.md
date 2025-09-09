# 仮想通貨確定申告支援アプリ

プライバシーを重視した仮想通貨の確定申告支援アプリケーションです。

## 特徴

- **プライバシー重視**: データは一切保存されません
- **オープンソース**: コードは完全に公開
- **学習目的**: Vue.js + Spring Boot の実装例

## 技術スタック

- **Frontend**: Vue 3 + TypeScript + Vuetify
- **Backend**: Spring Boot 3 + H2 In-Memory
- **Infrastructure**: Docker + Docker Compose

## セキュリティ

- APIキーは環境変数で管理
- データは全てインメモリ処理
- セッション終了で自動削除

## セットアップ

1. リポジトリをクローン
```bash
git clone https://github.com/your-username/crypto-tax-calculator.git
cd crypto-tax-calculator
```

2. 環境変数を設定
```bash
cp .env.example .env
# .envファイルに必要なAPIキーを設定
```

3. Dockerで起動
```bash
docker-compose up -d
```

4. ブラウザでアクセス
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

## 開発環境

### 前提条件
- Docker & Docker Compose
- Node.js 18+ (ローカル開発時)
- Java 17+ (ローカル開発時)

### ローカル開発

#### バックエンド
```bash
cd backend
./mvnw spring-boot:run
```

#### フロントエンド
```bash
cd frontend
npm install
npm run dev
```

## API ドキュメント

詳細なAPI仕様については [docs/API.md](docs/API.md) を参照してください。

## セキュリティ

セキュリティに関する詳細は [docs/SECURITY.md](docs/SECURITY.md) を参照してください。

## ライセンス

MIT License - 学習目的での使用を推奨します。

## 注意事項

このアプリケーションは学習目的で作成されています。実際の税務申告には専門家にご相談ください。