import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Transaction, TaxCalculationResult } from '@/types/transaction'
import { transactionApi } from '@/utils/api'

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref<Transaction[]>([])
  const taxResult = ref<TaxCalculationResult | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const totalTransactions = computed(() => transactions.value.length)
  
  const totalByType = computed(() => {
    return transactions.value.reduce((acc, transaction) => {
      acc[transaction.type] = (acc[transaction.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  })

  const fetchTransactions = async () => {
    try {
      loading.value = true
      error.value = null
      transactions.value = await transactionApi.getTransactions()
    } catch (err) {
      error.value = '取引データの取得に失敗しました'
      console.error('Failed to fetch transactions:', err)
    } finally {
      loading.value = false
    }
  }

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      loading.value = true
      error.value = null
      const newTransaction = await transactionApi.addTransaction(transaction)
      transactions.value.push(newTransaction)
      return newTransaction
    } catch (err) {
      error.value = '取引の追加に失敗しました'
      console.error('Failed to add transaction:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTransaction = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      await transactionApi.deleteTransaction(id)
      transactions.value = transactions.value.filter(t => t.id !== id)
    } catch (err) {
      error.value = '取引の削除に失敗しました'
      console.error('Failed to delete transaction:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const calculateTax = async () => {
    try {
      loading.value = true
      error.value = null
      taxResult.value = await transactionApi.calculateTax()
      return taxResult.value
    } catch (err) {
      error.value = '税額計算に失敗しました'
      console.error('Failed to calculate tax:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearAllData = async () => {
    try {
      loading.value = true
      error.value = null
      await transactionApi.clearData()
      transactions.value = []
      taxResult.value = null
    } catch (err) {
      error.value = 'データのクリアに失敗しました'
      console.error('Failed to clear data:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    transactions,
    taxResult,
    loading,
    error,
    totalTransactions,
    totalByType,
    fetchTransactions,
    addTransaction,
    deleteTransaction,
    calculateTax,
    clearAllData,
    clearError
  }
})