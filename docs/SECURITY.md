# セキュリティガイド

## 概要

この仮想通貨確定申告支援アプリは、プライバシーとセキュリティを最優先に設計されています。

## セキュリティ原則

### 1. データの非永続化

- **インメモリ処理**: 全てのデータはH2インメモリデータベースで処理
- **セッション終了時削除**: ブラウザを閉じるとデータは自動削除
- **永続化なし**: ファイルやディスクにデータを保存しない

### 2. APIキー管理

- **環境変数**: APIキーは環境変数で管理
- **設定ファイル除外**: `.gitignore`でAPIキー設定ファイルを除外
- **ローカル処理**: APIキーはサーバーサイドでのみ使用

### 3. 通信セキュリティ

- **HTTPS推奨**: 本番環境では必ずHTTPS使用
- **CORS設定**: 適切なオリジン制限を設定
- **セッション管理**: 安全なセッション設定

## 実装されているセキュリティ機能

### Spring Security設定

#### CSRF保護
```java
// CSRFは現在無効（SPA用）
.csrf(csrf -> csrf.disable())
```

#### セッション管理
```java
// ステートレスセッション
.sessionManagement(session -> 
    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
```

#### セキュリティヘッダー
```java
.headers(headers -> headers
    .frameOptions().sameOrigin()
    .referrerPolicy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN)
    .httpStrictTransportSecurity(hstsConfig -> hstsConfig
        .maxAgeInSeconds(31536000)
        .includeSubdomains(true)
    )
)
```

### CORS設定

```yaml
cors:
  allowed:
    origins: ${CORS_ORIGINS:http://localhost:3000}
```

```java
registry.addMapping("/api/**")
    .allowedOriginPatterns(allowedOrigins.split(","))
    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
    .allowedHeaders("*")
    .allowCredentials(true)
    .maxAge(3600);
```

## セキュリティベストプラクティス

### 1. 環境設定

#### 本番環境設定

```env
# 強力なJWTシークレット（32文字以上）
JWT_SECRET=your_very_long_and_random_secret_key_here

# HTTPS環境のCORS設定
CORS_ORIGINS=https://your-secure-domain.com

# 本番モード
APP_ENV=production
NODE_ENV=production
```

#### セッション設定

```yaml
server:
  servlet:
    session:
      timeout: 30m  # 30分でタイムアウト
```

### 2. APIキー保護

#### 環境変数での管理

```bash
# APIキーは環境変数で設定
export COINGECKO_API_KEY="your_api_key"
export COINMARKETCAP_API_KEY="your_api_key"
```

#### Docker Secrets使用

```yaml
version: '3.8'

services:
  backend:
    secrets:
      - coingecko_api_key
      - coinmarketcap_api_key
    environment:
      - COINGECKO_API_KEY_FILE=/run/secrets/coingecko_api_key
      - COINMARKETCAP_API_KEY_FILE=/run/secrets/coinmarketcap_api_key

secrets:
  coingecko_api_key:
    file: ./secrets/coingecko_api_key.txt
  coinmarketcap_api_key:
    file: ./secrets/coinmarketcap_api_key.txt
```

### 3. HTTPS設定

#### Nginx リバースプロキシ

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/private.key;
    
    # セキュリティヘッダー
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    
    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /api/ {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4. コンテナセキュリティ

#### 非rootユーザーの使用

```dockerfile
# Dockerfile (backend)
FROM openjdk:17-jdk-slim

# 非rootユーザーを作成
RUN groupadd -r appuser && useradd -r -g appuser appuser
USER appuser

WORKDIR /app
```

```dockerfile
# Dockerfile (frontend)
FROM node:18-alpine

# 非rootユーザーを作成
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

WORKDIR /app
```

#### セキュリティスキャン

```bash
# コンテナイメージの脆弱性スキャン
docker scout cves crypto-tax-calculator:latest
```

### 5. ログセキュリティ

#### 機密情報の除外

```java
// application.yml
logging:
  pattern:
    console: "%d{ISO8601} [%thread] %-5level %logger{36} - %msg%n"
  level:
    org.springframework.web.filter.CommonsRequestLoggingFilter: DEBUG
    
# 機密情報をマスク
@JsonIgnore
private String apiKey;
```

## セキュリティチェックリスト

### デプロイ前チェック

- [ ] APIキーが環境変数で管理されている
- [ ] `.env`ファイルが`.gitignore`に含まれている  
- [ ] HTTPS設定が完了している
- [ ] CORS設定が適切に制限されている
- [ ] セッションタイムアウトが設定されている
- [ ] セキュリティヘッダーが設定されている
- [ ] コンテナが非rootユーザーで実行されている
- [ ] 不要なポートが公開されていない
- [ ] ログに機密情報が含まれていない

### 運用時チェック

- [ ] 定期的なセキュリティアップデート
- [ ] 依存関係の脆弱性チェック
- [ ] アクセスログの監視
- [ ] 異常なトラフィックの検知
- [ ] APIキーのローテーション

## 脆弱性対応

### 依存関係の脆弱性チェック

#### Maven（Backend）

```bash
cd backend
./mvnw dependency-check:check
```

#### npm（Frontend）

```bash
cd frontend
npm audit
npm audit fix
```

### セキュリティアップデート

```bash
# 定期的な更新
docker-compose pull
docker-compose up -d
```

## インシデント対応

### セキュリティインシデント発生時

1. **即座の対応**
   - アプリケーションの停止
   - 影響範囲の調査
   - ログの保全

2. **復旧作業**
   - 脆弱性の修正
   - セキュリティパッチの適用
   - 設定の見直し

3. **事後対応**
   - インシデントレポート作成
   - 再発防止策の実装
   - セキュリティテストの強化

## 免責事項

- このアプリケーションは学習目的で作成されています
- セキュリティ要件は一般的なWeb アプリケーションレベルです
- 金融機関レベルのセキュリティは実装されていません
- 実際の税務申告や金融取引には使用しないでください
- セキュリティに関する責任は利用者が負うものとします