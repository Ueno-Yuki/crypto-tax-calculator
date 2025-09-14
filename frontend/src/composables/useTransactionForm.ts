import { ref, computed } from 'vue'
import { useTransactionStore } from '@/stores/transaction'
import { COINCHECK_CRYPTOCURRENCIES } from '@/constants/crypto'
import type { Transaction } from '@/types/transaction'

export interface TransactionFormData {
  type: 'BUY' | 'SELL' | 'SEND' | 'RECEIVE'
  symbol: string
  amount: number
  priceJpy?: number
  transactionDate: string
  exchange: string
  notes: string
}

export const useTransactionForm = () => {
  const transactionStore = useTransactionStore()
  const { loading } = transactionStore

  const form = ref()
  const valid = ref(false)

  const formData = ref<Omit<Transaction, 'id'>>({
    type: 'BUY',
    symbol: '',
    amount: 0,
    priceJpy: undefined,
    transactionDate: new Date().toISOString().slice(0, 16),
    exchange: 'Coincheck',
    notes: ''
  })

  const transactionTypes = [
    { title: '購入', value: 'BUY' },
    { title: '売却', value: 'SELL' },
    { title: '送金', value: 'SEND' },
    { title: '受取', value: 'RECEIVE' }
  ]

  // 仮想通貨オプション
  const cryptoCurrencyOptions = computed(() => {
    return COINCHECK_CRYPTOCURRENCIES.map(crypto => ({
      ...crypto,
      displayText: `${crypto.symbol} - ${crypto.name}`
    }))
  })

  // バリデーションルール
  const rules = {
    required: (value: any) => !!value || '必須項目です',
    positiveNumber: (value: any) => {
      if (!value) return true
      
      const stringValue = String(value)
      const hasInvalidChars = /[^\d.\-+eE]/.test(stringValue)
      if (hasInvalidChars) {
        return '数値のみ入力してください'
      }
      
      const num = Number(value)
      if (isNaN(num)) {
        return '有効な数値を入力してください'
      }
      
      return num > 0 || '正の数値を入力してください'
    }
  }

  // 全角数字を半角数字に変換
  const convertToHalfWidth = (str: string): string => {
    return str.replace(/[０-９]/g, (char) => {
      return String.fromCharCode(char.charCodeAt(0) - 0xFEE0)
    }).replace(/．/g, '.')
  }

  // 数値として有効かチェック
  const isValidNumber = (str: string): boolean => {
    if (!str) return true
    const converted = convertToHalfWidth(str)
    const num = parseFloat(converted)
    return !isNaN(num) && isFinite(num)
  }

  // フォーカスアウト時の処理
  const handleBlur = (event: Event, fieldName: 'amount' | 'priceJpy') => {
    const target = event.target as HTMLInputElement
    let value = target.value
    
    if (!value) return
    
    if (!isValidNumber(value)) {
      return
    }
    
    const convertedValue = convertToHalfWidth(value)
    
    if (fieldName === 'amount') {
      formData.value.amount = convertedValue ? Number(convertedValue) : 0
    } else if (fieldName === 'priceJpy') {
      formData.value.priceJpy = convertedValue ? Number(convertedValue) : undefined
    }
    
    target.value = convertedValue
  }

  // フォーム送信
  const submitForm = async (): Promise<boolean> => {
    if (!form.value) return false
    
    const { valid: isValid } = await form.value.validate()
    
    if (isValid) {
      try {
        const transactionData = {
          ...formData.value,
          symbol: formData.value.symbol.toUpperCase(),
          amount: Number(formData.value.amount),
          priceJpy: formData.value.priceJpy ? Number(formData.value.priceJpy) : undefined
        }
        
        await transactionStore.addTransaction(transactionData)
        return true
      } catch (error) {
        console.error('Failed to add transaction:', error)
        return false
      }
    }
    
    return false
  }

  // フォームリセット
  const resetForm = () => {
    formData.value = {
      type: 'BUY',
      symbol: '',
      amount: 0,
      priceJpy: undefined,
      transactionDate: new Date().toISOString().slice(0, 16),
      exchange: 'Coincheck',
      notes: ''
    }
    
    if (form.value) {
      form.value.resetValidation()
    }
  }

  return {
    // State
    form,
    valid,
    formData,
    loading,
    
    // Options
    transactionTypes,
    cryptoCurrencyOptions,
    rules,
    
    // Methods
    handleBlur,
    submitForm,
    resetForm,
    convertToHalfWidth,
    isValidNumber
  }
}