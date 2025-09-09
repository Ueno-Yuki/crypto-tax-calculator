# セットアップガイド

## 前提条件

### 必要なソフトウェア

#### Dockerを使用する場合（推奨）
- Docker Desktop または Docker Engine (20.10+)
- Docker Compose (2.0+)

#### ローカル開発の場合
- Java 17+
- Node.js 18+
- Maven 3.8+

## Dockerを使用したセットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/your-username/crypto-tax-calculator.git
cd crypto-tax-calculator
```

### 2. 環境変数の設定

```bash
cp .env.example .env
```

`.env`ファイルを編集して必要な設定を行います：

```env
# 仮想通貨価格取得API設定
COINGECKO_API_KEY=your_coingecko_api_key_here
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key_here

# アプリケーション設定
APP_ENV=development
APP_PORT=8080
FRONTEND_PORT=3000

# セキュリティ設定
JWT_SECRET=your_jwt_secret_key_here
CORS_ORIGINS=http://localhost:3000
```

### 3. アプリケーションの起動

```bash
docker-compose up -d
```

### 4. 動作確認

- **フロントエンド**: http://localhost:3000
- **バックエンドAPI**: http://localhost:8080/api/health
- **H2コンソール**: http://localhost:8080/h2-console

## ローカル開発環境のセットアップ

### バックエンド（Spring Boot）

#### 1. Mavenラッパーの実行権限を付与

```bash
cd backend
chmod +x mvnw
```

#### 2. 依存関係のインストール

```bash
./mvnw clean install
```

#### 3. アプリケーションの起動

```bash
./mvnw spring-boot:run
```

#### 4. 動作確認

```bash
curl http://localhost:8080/api/health
```

### フロントエンド（Vue 3 + TypeScript）

#### 1. 依存関係のインストール

```bash
cd frontend
npm install
```

#### 2. 開発サーバーの起動

```bash
npm run dev
```

#### 3. ビルド（本番用）

```bash
npm run build
```

#### 4. 型チェック

```bash
npm run type-check
```

#### 5. リント

```bash
npm run lint
```

## データベース設定

### H2 In-Memory Database

デフォルトではH2インメモリデータベースを使用します。

- **URL**: jdbc:h2:mem:cryptotax
- **Username**: sa
- **Password**: (空)

### H2 Console アクセス

開発環境では H2 Console が有効になっています：

1. http://localhost:8080/h2-console にアクセス
2. JDBC URL: `jdbc:h2:mem:cryptotax`
3. Username: `sa`
4. Password: (空のまま)

## APIキーの取得

### CoinGecko API

1. [CoinGecko API](https://www.coingecko.com/en/api)にアクセス
2. 無料アカウントを作成
3. APIキーを取得
4. `.env`ファイルの`COINGECKO_API_KEY`に設定

### CoinMarketCap API

1. [CoinMarketCap API](https://coinmarketcap.com/api/)にアクセス
2. 無料アカウントを作成
3. APIキーを取得
4. `.env`ファイルの`COINMARKETCAP_API_KEY`に設定

## トラブルシューティング

### ポート競合エラー

デフォルトのポート（3000, 8080）が使用されている場合：

```bash
# .envファイルでポートを変更
APP_PORT=8081
FRONTEND_PORT=3001
```

### Docker関連エラー

#### コンテナが起動しない場合

```bash
# ログを確認
docker-compose logs

# コンテナを再構築
docker-compose down
docker-compose up --build
```

#### データベース接続エラー

```bash
# H2コンソールで接続確認
# JDBC URL: jdbc:h2:mem:cryptotax
# Username: sa
# Password: (空)
```

### Maven関連エラー

#### 依存関係の問題

```bash
cd backend
./mvnw clean install -U
```

#### コンパイルエラー

Java 17が正しくインストールされているか確認：

```bash
java -version
```

### Node.js関連エラー

#### パッケージインストールエラー

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### TypeScriptエラー

```bash
npm run type-check
```

## 本番環境デプロイ

### Docker Compose（本番）

```bash
# 本番用の設定を使用
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 環境変数（本番）

```env
APP_ENV=production
NODE_ENV=production
LOG_LEVEL=WARN
```

## セキュリティ設定

### JWT Secret

```bash
# 安全なランダム文字列を生成
openssl rand -base64 32
```

### CORS設定

```env
CORS_ORIGINS=https://your-domain.com
```

## パフォーマンス設定

### JVM設定

```bash
# Docker環境でのJVMメモリ設定
JAVA_OPTS="-Xmx512m -Xms256m"
```

### Node.js設定

```bash
# メモリ制限
NODE_OPTIONS="--max-old-space-size=1024"
```