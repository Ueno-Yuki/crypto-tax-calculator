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
                <v-text-field
                  v-model="formData.symbol"
                  label="仮想通貨シンボル *"
                  placeholder="例: BTC, ETH"
                  :rules="[rules.required]"
                  required
                />
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.amount"
                  label="数量 *"
                  type="number"
                  step="0.00000001"
                  :rules="[rules.required, rules.positiveNumber]"
                  required
                />
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.priceJpy"
                  label="価格 (JPY)"
                  type="number"
                  step="0.01"
                  :rules="[rules.positiveNumber]"
                  placeholder="1単位あたりの価格"
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
  exchange: '',
  notes: ''
})

const transactionTypes = [
  { title: '購入', value: 'BUY' },
  { title: '売却', value: 'SELL' },
  { title: '送金', value: 'SEND' },
  { title: '受取', value: 'RECEIVE' }
]

const rules = {
  required: (value: any) => !!value || '必須項目です',
  positiveNumber: (value: any) => !value || value > 0 || '正の数値を入力してください'
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
    exchange: '',
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
</style>