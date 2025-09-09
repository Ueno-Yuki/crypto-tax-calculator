<template>
  <div>
    <h1>仮想通貨確定申告支援</h1>
    
    <!-- 統計カード -->
    <v-row class="mb-4">
      <v-col cols="3">
        <v-card color="primary">
          <v-card-text class="text-white">
            <div class="text-h6">{{ totalTransactions }}</div>
            <div>総取引数</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="3">
        <v-card color="success">
          <v-card-text class="text-white">
            <div class="text-h6">{{ buyCount }}</div>
            <div>購入取引</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="3">
        <v-card color="error">
          <v-card-text class="text-white">
            <div class="text-h6">{{ sellCount }}</div>
            <div>売却取引</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="3">
        <v-card color="info">
          <v-card-text class="text-white">
            <div class="text-h6">{{ hasResult ? '済' : '未' }}</div>
            <div>税額計算</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- ボタン -->
    <v-row class="mb-4">
      <v-col>
        <v-btn color="primary" @click="showDialog = true">
          取引追加
        </v-btn>
        <v-btn 
          color="success" 
          class="ml-2" 
          @click="calculateTax"
          :loading="loading"
        >
          税額計算
        </v-btn>
      </v-col>
    </v-row>

    <!-- エラー表示 -->
    <v-alert v-if="error" type="error" class="mb-4">
      {{ error }}
    </v-alert>

    <!-- 取引一覧 -->
    <v-card>
      <v-card-title>取引履歴</v-card-title>
      <v-card-text>
        <div v-if="transactions.length === 0">
          取引データがありません
        </div>
        <div v-else>
          <div v-for="transaction in transactions" :key="transaction.id" class="mb-2 pa-2 border">
            <div>
              <strong>{{ getTypeText(transaction.type) }}</strong> - 
              {{ transaction.symbol }} - 
              {{ transaction.amount }} - 
              ¥{{ transaction.priceJpy || 0 }}
            </div>
            <div class="text-caption">
              {{ formatDate(transaction.transactionDate) }}
            </div>
            <v-btn 
              size="small" 
              color="error" 
              @click="deleteTransaction(transaction.id)"
              :disabled="!transaction.id"
            >
              削除
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- ポートフォリオチャート -->
    <PortfolioChart 
      v-if="transactions.length > 0"
      class="mb-4"
    />
    
    <!-- 価格シミュレーション -->
    <SimulationChart 
      v-if="transactions.length > 0"
      class="mb-4"
    />

    <!-- 計算結果 -->
    <v-card v-if="taxResult" class="mt-4">
      <v-card-title>税額計算結果</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="4">
            <div class="text-center">
              <div class="text-h6" :class="gainLossColor">
                ¥{{ formatNumber(taxResult.totalGainLoss) }}
              </div>
              <div>総損益</div>
            </div>
          </v-col>
          <v-col cols="4">
            <div class="text-center">
              <div class="text-h6">¥{{ formatNumber(taxResult.totalPurchaseAmount) }}</div>
              <div>総購入額</div>
            </div>
          </v-col>
          <v-col cols="4">
            <div class="text-center">
              <div class="text-h6">¥{{ formatNumber(taxResult.totalSaleAmount) }}</div>
              <div>総売却額</div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- ダイアログ -->
    <TransactionForm
      v-model="showDialog"
      @transaction-added="onTransactionAdded"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTransactionStore } from '@/stores/transaction'
import { storeToRefs } from 'pinia'
import TransactionForm from '@/components/TransactionForm.vue'
import { PortfolioChart, SimulationChart } from '@/components/charts'

const transactionStore = useTransactionStore()
const { 
  transactions, 
  taxResult, 
  loading, 
  error, 
  totalTransactions, 
  totalByType 
} = storeToRefs(transactionStore)

const showDialog = ref(false)

// Computed properties
const buyCount = computed(() => totalByType.value.BUY || 0)
const sellCount = computed(() => totalByType.value.SELL || 0)
const hasResult = computed(() => !!taxResult.value)
const gainLossColor = computed(() => {
  if (!taxResult.value) return ''
  return taxResult.value.totalGainLoss >= 0 ? 'text-success' : 'text-error'
})

// Methods
const getTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    BUY: '購入',
    SELL: '売却',
    SEND: '送金',
    RECEIVE: '受取'
  }
  return typeMap[type] || type
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('ja-JP').format(num)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('ja-JP')
}

const calculateTax = async () => {
  await transactionStore.calculateTax()
}

const deleteTransaction = async (id: number | undefined) => {
  if (!id) return
  if (confirm('この取引を削除しますか？')) {
    await transactionStore.deleteTransaction(id)
  }
}

const onTransactionAdded = () => {
  showDialog.value = false
  transactionStore.fetchTransactions()
}

// エラークリア機能は将来使用予定
// const { clearError } = transactionStore

// Lifecycle
onMounted(() => {
  transactionStore.fetchTransactions()
})
</script>

<style scoped>
.border {
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>