# 仮想通貨確定申告支援アプリ

## 特徴
- プライバシー重視：データは一切保存されません
- オープンソース：コードは完全に公開
- 学習目的：Vue.js + Spring Boot の実装例

## 技術スタック
- Frontend: Vue 3 + TypeScript + Vuetify
- Backend: Spring Boot 3 + H2 In-Memory
- Infrastructure: Docker + Docker Compose

## セキュリティ
- APIキーは環境変数で管理
- データは全てインメモリ処理
- セッション終了で自動削除

## プロジェクト構造
crypto-tax-calculator/
├── README.md
├── docker-compose.yml
├── .env.example
├── .gitignore
├── backend/
│   ├── src/main/java/
│   │   └── com/cryptotax/
│   │       ├── CryptoTaxApplication.java
│   │       ├── controller/
│   │       ├── service/
│   │       ├── model/
│   │       └── config/
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── stores/
│   │   └── types/
│   ├── package.json
│   └── vite.config.ts
└── docs/
    ├── API.md
    ├── SETUP.md
    └── SECURITY.md