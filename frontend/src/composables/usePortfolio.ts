// ポートフォリオ管理のComposable

import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useTransactionStore } from '@/stores/transaction'
import type { 
  AssetHolding, 
  PortfolioSnapshot, 
  AssetPerformance,
  PriceSimulation 
} from '@/types/api/portfolio'
import dayjs from 'dayjs'

export function usePortfolio() {
  const transactionStore = useTransactionStore()
  const { transactions } = storeToRefs(transactionStore)
  
  const currentHoldings = ref<AssetHolding[]>([])
  const portfolioHistory = ref<PortfolioSnapshot[]>([])
  const loading = ref(false)
  
  // 現在の保有資産を計算
  const calculateCurrentHoldings = () => {
    const holdings = new Map<string, AssetHolding>()
    
    transactions.value.forEach(tx => {
      const existing = holdings.get(tx.symbol) || {
        symbol: tx.symbol,
        amount: 0,
        totalCost: 0,
        averageCost: 0
      }
      
      if (tx.type === 'BUY' || tx.type === 'RECEIVE') {
        existing.amount += tx.amount
        existing.totalCost += tx.amount * (tx.priceJpy || 0)
      } else if (tx.type === 'SELL' || tx.type === 'SEND') {
        const sellAmount = Math.min(tx.amount, existing.amount)
        const sellCostRatio = sellAmount / existing.amount
        existing.amount -= sellAmount
        existing.totalCost -= existing.totalCost * sellCostRatio
      }
      
      existing.averageCost = existing.amount > 0 ? existing.totalCost / existing.amount : 0
      holdings.set(tx.symbol, existing)
    })
    
    currentHoldings.value = Array.from(holdings.values())
      .filter(h => h.amount > 0)
      .sort((a, b) => b.totalCost - a.totalCost)
  }
  
  // 特定日付での資産評価を計算
  const calculateAssetPerformance = (targetDate: string, currentPrices: Record<string, number>): AssetPerformance[] => {
    const targetDateObj = dayjs(targetDate)
    const relevantTransactions = transactions.value.filter(tx => 
      dayjs(tx.transactionDate).isBefore(targetDateObj) || 
      dayjs(tx.transactionDate).isSame(targetDateObj, 'day')
    )
    
    const holdings = new Map<string, { amount: number; totalCost: number; firstPurchaseDate: string }>()
    
    relevantTransactions.forEach(tx => {
      const existing = holdings.get(tx.symbol) || { 
        amount: 0, 
        totalCost: 0, 
        firstPurchaseDate: tx.transactionDate 
      }
      
      if (tx.type === 'BUY' || tx.type === 'RECEIVE') {
        existing.amount += tx.amount
        existing.totalCost += tx.amount * (tx.priceJpy || 0)
        if (dayjs(tx.transactionDate).isBefore(existing.firstPurchaseDate)) {
          existing.firstPurchaseDate = tx.transactionDate
        }
      } else if (tx.type === 'SELL' || tx.type === 'SEND') {
        const sellAmount = Math.min(tx.amount, existing.amount)
        const sellCostRatio = sellAmount / existing.amount
        existing.amount -= sellAmount
        existing.totalCost -= existing.totalCost * sellCostRatio
      }
      
      holdings.set(tx.symbol, existing)
    })
    
    return Array.from(holdings.entries())
      .filter(([_, data]) => data.amount > 0)
      .map(([symbol, data]) => {
        const currentPrice = currentPrices[symbol] || 0
        const currentValue = data.amount * currentPrice
        const averageCost = data.totalCost / data.amount
        const unrealizedGainLoss = currentValue - data.totalCost
        const gainLossPercentage = data.totalCost > 0 ? (unrealizedGainLoss / data.totalCost) * 100 : 0
        
        return {
          symbol,
          purchaseDate: data.firstPurchaseDate,
          purchasePrice: averageCost,
          currentPrice,
          amount: data.amount,
          unrealizedGainLoss,
          gainLossPercentage
        }
      })
      .sort((a, b) => Math.abs(b.unrealizedGainLoss) - Math.abs(a.unrealizedGainLoss))
  }
  
  // 価格シミュレーション
  const simulatePrice = (params: {
    symbol: string
    targetDate: string
    simulatedPrice: number
  }): PriceSimulation => {
    const { symbol, targetDate, simulatedPrice } = params
    
    const targetDateObj = dayjs(targetDate)
    const relevantTransactions = transactions.value.filter(tx => 
      tx.symbol === symbol && (
        dayjs(tx.transactionDate).isBefore(targetDateObj) || 
        dayjs(tx.transactionDate).isSame(targetDateObj, 'day')
      )
    )
    
    let currentHoldings = 0
    let totalCost = 0
    
    relevantTransactions.forEach(tx => {
      if (tx.type === 'BUY' || tx.type === 'RECEIVE') {
        currentHoldings += tx.amount
        totalCost += tx.amount * (tx.priceJpy || 0)
      } else if (tx.type === 'SELL' || tx.type === 'SEND') {
        const sellRatio = tx.amount / currentHoldings
        currentHoldings -= tx.amount
        totalCost -= totalCost * sellRatio
      }
    })
    
    const simulatedValue = currentHoldings * simulatedPrice
    const potentialGainLoss = simulatedValue - totalCost
    
    return {
      symbol,
      targetDate,
      simulatedPrice,
      currentHoldings,
      simulatedValue,
      potentialGainLoss
    }
  }
  
  // ポートフォリオの総価値を計算
  const totalPortfolioValue = computed(() => {
    return currentHoldings.value.reduce((total, holding) => {
      return total + (holding.currentValue || 0)
    }, 0)
  })
  
  // 総投資額
  const totalInvestment = computed(() => {
    return currentHoldings.value.reduce((total, holding) => {
      return total + holding.totalCost
    }, 0)
  })
  
  // 総損益
  const totalGainLoss = computed(() => {
    return totalPortfolioValue.value - totalInvestment.value
  })
  
  // 損益率
  const totalGainLossPercentage = computed(() => {
    return totalInvestment.value > 0 
      ? (totalGainLoss.value / totalInvestment.value) * 100 
      : 0
  })
  
  // 取引データが変更されたら再計算
  watch(transactions, calculateCurrentHoldings, { deep: true, immediate: true })
  
  return {
    // State
    currentHoldings,
    portfolioHistory,
    loading,
    
    // Computed
    totalPortfolioValue,
    totalInvestment,
    totalGainLoss,
    totalGainLossPercentage,
    
    // Methods
    calculateCurrentHoldings,
    calculateAssetPerformance,
    simulatePrice
  }
}