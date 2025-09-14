<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h5">取引追加</span>
      </v-card-title>
      
      <v-card-text>
        <v-container>
          <v-form ref="form" v-model="valid">
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.type"
                  :items="transactionTypes"
                  label="取引種別 *"
                  :rules="[rules.required]"
                  required
                />
              </v-col>
              
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="formData.symbol"
                  :items="cryptoCurrencyOptions"
                  item-title="displayText"
                  item-value="symbol"
                  label="仮想通貨シンボル *"
                  placeholder="通貨を選択または検索..."
                  :rules="[rules.required]"
                  required
                  clearable
                >
                  <template #item="{ item, props }">
                    <v-list-item v-bind="props">
                      <template #prepend>
                        <v-avatar 
                          size="24" 
                          class="me-3"
                          :style="{ backgroundColor: item.raw.color }"
                        >
                          <v-icon 
                            :icon="item.raw.icon" 
                            size="small" 
                            color="white"
                          />
                        </v-avatar>
                      </template>
                    </v-list-item>
                  </template>
                  <template #selection="{ item }">
                    <div class="d-flex align-center">
                      <v-avatar 
                        size="20" 
                        class="me-2"
                        :style="{ backgroundColor: item.raw.color }"
                      >
                        <v-icon 
                          :icon="item.raw.icon" 
                          size="x-small" 
                          color="white"
                        />
                      </v-avatar>
                      <span>{{ item.raw.displayText }}</span>
                    </div>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.amount"
                  label="数量 *"
                  :rules="[rules.required, rules.positiveNumber]"
                  placeholder="例: 0.5, 0.00000001"
                  required
                  inputmode="decimal"
                  @blur="handleBlur($event, 'amount')"
                />
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.priceJpy"
                  label="価格 (JPY)"
                  :rules="[rules.positiveNumber]"
                  placeholder="例: 5000000"
                  inputmode="decimal"
                  @blur="handleBlur($event, 'priceJpy')"
                />
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.transactionDate"
                  label="取引日時 *"
                  type="datetime-local"
                  :rules="[rules.required]"
                  required
                />
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.exchange"
                  label="取引所"
                  placeholder="例: Binance, Coincheck"
                />
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="formData.notes"
                  label="メモ"
                  rows="3"
                  placeholder="追加情報があれば記入してください"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer />
        <v-btn 
          color="grey" 
          variant="text" 
          @click="closeDialog"
        >
          キャンセル
        </v-btn>
        <v-btn 
          color="primary" 
          variant="elevated"
          @click="submitForm"
          :loading="loading"
          :disabled="!valid"
        >
          追加
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useTransactionStore } from '@/stores/transaction'
import { COINCHECK_CRYPTOCURRENCIES } from '@/constants/crypto'
import type { Transaction } from '@/types/transaction'

interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'transaction-added'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const transactionStore = useTransactionStore()
const { loading } = transactionStore

const form = ref()
const valid = ref(false)

const dialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

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

// 仮想通貨オプションのcomputed property
const cryptoCurrencyOptions = computed(() => {
  return COINCHECK_CRYPTOCURRENCIES.map(crypto => ({
    ...crypto,
    displayText: `${crypto.symbol} - ${crypto.name}`
  }))
})

const rules = {
  required: (value: any) => !!value || '必須項目です',
  positiveNumber: (value: any) => {
    if (!value) return true
    
    // 文字列の場合、数値として解析可能かチェック
    const stringValue = String(value)
    
    // 日本語文字や数値以外の文字が含まれているかチェック
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

// 全角数字を半角数字に変換する関数
const convertToHalfWidth = (str: string): string => {
  return str.replace(/[０-９]/g, (char) => {
    return String.fromCharCode(char.charCodeAt(0) - 0xFEE0)
  }).replace(/．/g, '.')
}

// 文字列が数値として有効かチェックする関数
const isValidNumber = (str: string): boolean => {
  // 空文字は有効とする
  if (!str) return true
  
  // 全角数字を半角に変換してからチェック
  const converted = convertToHalfWidth(str)
  
  // 数値として解析可能で、NaNでないかチェック
  const num = parseFloat(converted)
  return !isNaN(num) && isFinite(num)
}

// フォーカスが外れた時の処理
const handleBlur = (event: Event, fieldName: 'amount' | 'priceJpy') => {
  const target = event.target as HTMLInputElement
  let value = target.value
  
  if (!value) return
  
  // 数値として有効かチェック
  if (!isValidNumber(value)) {
    // 無効な場合はバリデーションに任せる（エラーメッセージ表示）
    return
  }
  
  // 全角数字を半角に変換
  const convertedValue = convertToHalfWidth(value)
  
  // 変換後の値を設定
  if (fieldName === 'amount') {
    formData.value.amount = convertedValue ? Number(convertedValue) : 0
  } else if (fieldName === 'priceJpy') {
    formData.value.priceJpy = convertedValue ? Number(convertedValue) : undefined
  }
  
  // 入力フィールドの表示も更新
  target.value = convertedValue
}

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    resetForm()
  }
})

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

const closeDialog = () => {
  dialog.value = false
  resetForm()
}

const submitForm = async () => {
  if (!form.value) return
  
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
      emit('transaction-added')
      closeDialog()
    } catch (error) {
      console.error('Failed to add transaction:', error)
    }
  }
}
</script>

<style scoped>
.v-card-title {
  background-color: #f5f5f5;
}

/* 数値入力フィールドのスタイル */
.v-text-field input[inputmode="decimal"] {
  font-variant-numeric: tabular-nums;
  text-align: left;
}
</style>