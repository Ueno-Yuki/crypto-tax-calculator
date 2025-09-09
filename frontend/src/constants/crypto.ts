// 仮想通貨関連の定数

export const SUPPORTED_CRYPTOCURRENCIES = [
  { symbol: 'BTC', name: 'Bitcoin', decimals: 8 },
  { symbol: 'ETH', name: 'Ethereum', decimals: 18 },
  { symbol: 'USDT', name: 'Tether', decimals: 6 },
  { symbol: 'BNB', name: 'Binance Coin', decimals: 18 },
  { symbol: 'SOL', name: 'Solana', decimals: 9 },
  { symbol: 'XRP', name: 'Ripple', decimals: 6 },
  { symbol: 'USDC', name: 'USD Coin', decimals: 6 },
  { symbol: 'ADA', name: 'Cardano', decimals: 6 },
  { symbol: 'AVAX', name: 'Avalanche', decimals: 18 },
  { symbol: 'DOGE', name: 'Dogecoin', decimals: 8 },
  { symbol: 'DOT', name: 'Polkadot', decimals: 10 },
  { symbol: 'MATIC', name: 'Polygon', decimals: 18 },
  { symbol: 'LINK', name: 'Chainlink', decimals: 18 },
  { symbol: 'LTC', name: 'Litecoin', decimals: 8 },
  { symbol: 'ATOM', name: 'Cosmos', decimals: 6 },
  { symbol: 'UNI', name: 'Uniswap', decimals: 18 },
  { symbol: 'ICP', name: 'Internet Computer', decimals: 8 },
  { symbol: 'FIL', name: 'Filecoin', decimals: 18 },
  { symbol: 'APT', name: 'Aptos', decimals: 8 },
  { symbol: 'ARB', name: 'Arbitrum', decimals: 18 }
] as const

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