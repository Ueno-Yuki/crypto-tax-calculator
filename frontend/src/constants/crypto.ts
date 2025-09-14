// 仮想通貨関連の定数

// Coincheckで取り扱っている仮想通貨（2024年12月時点）
export const COINCHECK_CRYPTOCURRENCIES = [
  { symbol: 'BTC', name: 'ビットコイン', decimals: 8, icon: 'mdi-bitcoin', color: '#F7931A' },
  { symbol: 'ETH', name: 'イーサリアム', decimals: 18, icon: 'mdi-ethereum', color: '#627EEA' },
  { symbol: 'ETC', name: 'イーサリアムクラシック', decimals: 18, icon: 'mdi-currency-sign', color: '#328332' },
  { symbol: 'LSK', name: 'リスク', decimals: 8, icon: 'mdi-currency-sign', color: '#0D47A1' },
  { symbol: 'XRP', name: 'リップル', decimals: 6, icon: 'mdi-currency-sign', color: '#23292F' },
  { symbol: 'XEM', name: 'ネム', decimals: 6, icon: 'mdi-currency-sign', color: '#67B2E8' },
  { symbol: 'LTC', name: 'ライトコイン', decimals: 8, icon: 'mdi-litecoin', color: '#BFBBBB' },
  { symbol: 'BCH', name: 'ビットコインキャッシュ', decimals: 8, icon: 'mdi-currency-sign', color: '#8DC351' },
  { symbol: 'MONA', name: 'モナコイン', decimals: 8, icon: 'mdi-currency-sign', color: '#FF6600' },
  { symbol: 'XLM', name: 'ステラルーメン', decimals: 7, icon: 'mdi-star-circle', color: '#7D00FF' },
  { symbol: 'QTUM', name: 'クアンタム', decimals: 8, icon: 'mdi-currency-sign', color: '#2E9AD0' },
  { symbol: 'BAT', name: 'バット', decimals: 18, icon: 'mdi-currency-sign', color: '#FF5000' },
  { symbol: 'IOST', name: 'アイオーエスティー', decimals: 8, icon: 'mdi-currency-sign', color: '#1C1C1C' },
  { symbol: 'ENJ', name: 'エンジンコイン', decimals: 18, icon: 'mdi-gamepad-variant', color: '#624DBF' },
  { symbol: 'OMG', name: 'オーエムジー', decimals: 18, icon: 'mdi-currency-sign', color: '#1A53F0' },
  { symbol: 'PLT', name: 'パレットトークン', decimals: 18, icon: 'mdi-palette', color: '#E50000' },
  { symbol: 'SAND', name: 'サンドボックス', decimals: 18, icon: 'mdi-cube', color: '#00D4FF' },
  { symbol: 'DOT', name: 'ポルカドット', decimals: 10, icon: 'mdi-currency-sign', color: '#E6007A' },
  { symbol: 'FNCT', name: 'ファンクションエックス', decimals: 18, icon: 'mdi-function', color: '#F5A623' },
  { symbol: 'CHZ', name: 'チリーズ', decimals: 18, icon: 'mdi-chili-hot', color: '#CD212A' },
  { symbol: 'LINK', name: 'チェーンリンク', decimals: 18, icon: 'mdi-link', color: '#375BD2' },
  { symbol: 'MKR', name: 'メイカー', decimals: 18, icon: 'mdi-currency-sign', color: '#1AAB9B' },
  { symbol: 'MATIC', name: 'ポリゴン', decimals: 18, icon: 'mdi-hexagon', color: '#8247E5' },
  { symbol: 'IMX', name: 'イミュータブルエックス', decimals: 18, icon: 'mdi-infinity', color: '#00D4FF' },
  { symbol: 'AXS', name: 'アクシーインフィニティ', decimals: 18, icon: 'mdi-gamepad-variant', color: '#0055D4' },
  { symbol: 'DOGE', name: 'ドージコイン', decimals: 8, icon: 'mdi-dog', color: '#C2A633' },
  { symbol: 'APE', name: 'エイプコイン', decimals: 18, icon: 'mdi-currency-sign', color: '#0D1421' },
] as const

// 後方互換性のため
export const SUPPORTED_CRYPTOCURRENCIES = COINCHECK_CRYPTOCURRENCIES

export const TRANSACTION_TYPES = [
  { value: 'BUY', label: '購入', color: 'success' },
  { value: 'SELL', label: '売却', color: 'error' },
  { value: 'SEND', label: '送金', color: 'warning' },
  { value: 'RECEIVE', label: '受取', color: 'info' }
] as const

export const POPULAR_EXCHANGES = [
  'Binance',
  'Coincheck',
  'bitFlyer',
  'GMO Coin',
  'Liquid',
  'Zaif',
  'Huobi',
  'Kraken',
  'Coinbase',
  'Bybit',
  'OKX',
  'その他'
] as const

export const CHART_TIMEFRAMES = [
  { value: '1d', label: '1日', days: 1 },
  { value: '7d', label: '1週間', days: 7 },
  { value: '30d', label: '1ヶ月', days: 30 },
  { value: '90d', label: '3ヶ月', days: 90 },
  { value: '1y', label: '1年', days: 365 },
  { value: 'all', label: '全期間', days: 0 }
] as const

// 税務関連の定数
export const TAX_CALCULATION_METHODS = [
  { value: 'moving_average', label: '移動平均法' },
  { value: 'fifo', label: '先入先出法' },
  { value: 'lifo', label: '後入先出法' }
] as const

// 価格更新間隔（ミリ秒）
export const PRICE_UPDATE_INTERVALS = {
  REAL_TIME: 1000,      // 1秒
  FREQUENT: 5000,       // 5秒
  NORMAL: 30000,        // 30秒
  SLOW: 300000          // 5分
} as const

// チャートのデフォルト設定
export const DEFAULT_CHART_OPTIONS = {
  width: 800,
  height: 400,
  layout: {
    textColor: '#333',
    background: {
      type: 'solid',
      color: '#ffffff'
    }
  },
  grid: {
    vertLines: {
      color: '#e1e1e1'
    },
    horzLines: {
      color: '#e1e1e1'
    }
  },
  timeScale: {
    borderColor: '#cccccc',
    timeVisible: true,
    secondsVisible: false
  },
  rightPriceScale: {
    borderColor: '#cccccc'
  },
  crosshair: {
    mode: 1 // CrosshairMode.Normal
  }
} as const