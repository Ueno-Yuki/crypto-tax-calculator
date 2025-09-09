import axios from 'axios'
import type { Transaction, TaxCalculationResult } from '@/types/transaction'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const transactionApi = {
  async getTransactions(): Promise<Transaction[]> {
    const response = await apiClient.get('/transactions')
    return response.data
  },

  async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const response = await apiClient.post('/transactions', transaction)
    return response.data
  },

  async deleteTransaction(id: number): Promise<void> {
    await apiClient.delete(`/transactions/${id}`)
  },

  async calculateTax(): Promise<TaxCalculationResult> {
    const response = await apiClient.post('/transactions/calculate-tax')
    return response.data
  },

  async clearData(): Promise<void> {
    await apiClient.delete('/transactions/clear')
  },

  async healthCheck(): Promise<{ status: string }> {
    const response = await apiClient.get('/health')
    return response.data
  },
}

export default apiClient