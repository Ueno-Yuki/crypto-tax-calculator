// ポートフォリオと資産推移関連の型定義

export interface PriceData {
  timestamp: number
  price: number
  symbol: string
}

export interface AssetHolding {
  symbol: string
  amount: number
  averageCost: number
  totalCost: number
  currentPrice?: number
  currentValue?: number
  unrealizedGainLoss?: number
}

export interface PortfolioSnapshot {
  date: string
  totalValue: number
  totalCost: number
  totalGainLoss: number
  holdings: AssetHolding[]
}

export interface AssetPerformance {
  symbol: string
  purchaseDate: string
  purchasePrice: number
  currentPrice: number
  amount: number
  unrealizedGainLoss: number
  gainLossPercentage: number
}

export interface PriceSimulation {
  symbol: string
  targetDate: string
  simulatedPrice: number
  currentHoldings: number
  simulatedValue: number
  potentialGainLoss: number
}

export interface ChartDataPoint {
  time: string | number
  value: number
  open?: number
  high?: number
  low?: number
  close?: number
}

export interface TimeSeriesData {
  symbol: string
  timeframe: '1d' | '7d' | '30d' | '90d' | '1y' | 'all'
  data: ChartDataPoint[]
}