// 取引関連の型定義

export interface Transaction {
  id?: number
  type: 'BUY' | 'SELL' | 'SEND' | 'RECEIVE'
  symbol: string
  amount: number
  priceJpy?: number
  transactionDate: string
  exchange?: string
  notes?: string
  sessionId?: string
  createdAt?: string
}

export interface TaxCalculationResult {
  totalGainLoss: number
  totalPurchaseAmount: number
  totalSaleAmount: number
  transactionSummaries: TransactionSummary[]
  calculatedAt: string
  sessionId: string
}

export interface TransactionSummary {
  symbol: string
  totalAmount: number
  totalPurchasePrice: number
  totalSalePrice: number
  gainLoss: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}