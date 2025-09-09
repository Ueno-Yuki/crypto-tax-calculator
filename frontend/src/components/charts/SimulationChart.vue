<template>
  <div class="simulation-panel">
    <div class="simulation-panel__title">
      <v-icon>mdi-calculator-variant</v-icon>
      価格シミュレーション
    </div>
    
    <!-- シミュレーション設定フォーム -->
    <div class="simulation-panel__form">
      <v-select
        v-model="simulationParams.symbol"
        :items="SUPPORTED_CRYPTOCURRENCIES"
        item-title="name"
        item-value="symbol"
        label="仮想通貨"
        variant="outlined"
        density="compact"
      />
      
      <v-text-field
        v-model="simulationParams.targetDate"
        type="date"
        label="対象日"
        variant="outlined"
        density="compact"
      />
      
      <v-text-field
        v-model="simulationParams.simulatedPrice"
        type="number"
        label="シミュレーション価格 (円)"
        variant="outlined"
        density="compact"
        step="0.01"
      />
      
      <v-btn
        color="primary"
        @click="runSimulation"
        :loading="loading"
        :disabled="!canRunSimulation"
      >
        シミュレーション実行
      </v-btn>
    </div>
    
    <!-- シミュレーション結果 -->
    <div v-if="simulationResult" class="simulation-panel__result">
      <div class="result-grid">
        <div class="result-item">
          <div class="result-label">対象日の保有数量</div>
          <div class="result-value">
            {{ formatNumber(simulationResult.currentHoldings) }} {{ simulationResult.symbol }}
          </div>
        </div>
        
        <div class="result-item">
          <div class="result-label">シミュレーション価値</div>
          <div class="result-value text-primary">
            ¥{{ formatNumber(simulationResult.simulatedValue) }}
          </div>
        </div>
        
        <div class="result-item">
          <div class="result-label">損益</div>
          <div class="result-value" :class="getValueClass(simulationResult.potentialGainLoss)">
            {{ simulationResult.potentialGainLoss >= 0 ? '+' : '' }}¥{{ formatNumber(simulationResult.potentialGainLoss) }}
          </div>
        </div>
      </div>
      
      <!-- 比較チャート -->
      <div v-if="comparisonData.length > 0" class="mt-4">
        <SimpleChart
          title="価格シミュレーション比較"
          :data="comparisonData"
          :height="300"
        />
      </div>
    </div>
    
    <!-- 複数シナリオシミュレーション -->
    <div v-if="showMultipleScenarios" class="mt-4">
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-title>
            複数シナリオシミュレーション
          </v-expansion-panel-title>
          
          <v-expansion-panel-text>
            <div class="scenario-grid">
              <div
                v-for="scenario in multipleScenarios"
                :key="scenario.price"
                class="scenario-item"
              >
                <div class="scenario-price">
                  ¥{{ formatNumber(scenario.price) }}
                </div>
                <div class="scenario-value" :class="getValueClass(scenario.gainLoss)">
                  {{ scenario.gainLoss >= 0 ? '+' : '' }}¥{{ formatNumber(scenario.gainLoss) }}
                </div>
                <div class="scenario-percentage" :class="getValueClass(scenario.gainLoss)">
                  {{ scenario.gainLoss >= 0 ? '+' : '' }}{{ scenario.percentage.toFixed(2) }}%
                </div>
              </div>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import SimpleChart from './SimpleChart.vue'
import { usePortfolio } from '@/composables/usePortfolio'
import type { PriceSimulation, ChartDataPoint } from '@/types/api/portfolio'
import { SUPPORTED_CRYPTOCURRENCIES } from '@/constants/crypto'
import dayjs from 'dayjs'

interface Props {
  theme?: 'light' | 'dark'
}

interface SimulationParams {
  symbol: string
  targetDate: string
  simulatedPrice: number
}

interface ScenarioResult {
  price: number
  value: number
  gainLoss: number
  percentage: number
}

withDefaults(defineProps<Props>(), {
  theme: 'light'
})

const loading = ref(false)
const showMultipleScenarios = ref(false)

const simulationParams = ref<SimulationParams>({
  symbol: 'ETH',
  targetDate: dayjs().format('YYYY-MM-DD'),
  simulatedPrice: 670000
})

const simulationResult = ref<PriceSimulation | null>(null)
const comparisonData = ref<ChartDataPoint[]>([])
const multipleScenarios = ref<ScenarioResult[]>([])

const { simulatePrice } = usePortfolio()

// シミュレーション実行可能かチェック
const canRunSimulation = computed(() => {
  return simulationParams.value.symbol && 
         simulationParams.value.targetDate && 
         simulationParams.value.simulatedPrice > 0
})

// シミュレーション実行
const runSimulation = async () => {
  if (!canRunSimulation.value) return
  
  loading.value = true
  
  try {
    // 単体シミュレーション
    simulationResult.value = simulatePrice({
      symbol: simulationParams.value.symbol,
      targetDate: simulationParams.value.targetDate,
      simulatedPrice: simulationParams.value.simulatedPrice
    })
    
    // 比較用のチャートデータを生成
    generateComparisonChart()
    
    // 複数シナリオシミュレーション
    generateMultipleScenarios()
    
    showMultipleScenarios.value = true
    
  } catch (error) {
    console.error('Simulation error:', error)
  } finally {
    loading.value = false
  }
}

// 比較チャート用データ生成
const generateComparisonChart = () => {
  if (!simulationResult.value) return
  
  const result = simulationResult.value
  const currentPrice = 500000 // サンプル現在価格（実際はAPIから取得）
  
  // 現在価格からシミュレーション価格までの推移を表示
  const priceRange = Math.abs(result.simulatedPrice - currentPrice)
  const steps = 30
  const priceStep = priceRange / steps
  
  const data: ChartDataPoint[] = []
  
  for (let i = 0; i <= steps; i++) {
    const price = currentPrice + (result.simulatedPrice > currentPrice ? 1 : -1) * priceStep * i
    const value = result.currentHoldings * price
    
    data.push({
      time: dayjs().add(i, 'days').format('YYYY-MM-DD'),
      value: value
    })
  }
  
  comparisonData.value = data
}

// 複数シナリオ生成
const generateMultipleScenarios = () => {
  if (!simulationResult.value) return
  
  const result = simulationResult.value
  const basePrice = simulationParams.value.simulatedPrice
  const holdings = result.currentHoldings
  
  // 投資元本を計算（実際の実装では正確に計算）
  const investmentCost = holdings * (basePrice * 0.8) // サンプル計算
  
  const scenarios: ScenarioResult[] = []
  const priceMultipliers = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0]
  
  priceMultipliers.forEach(multiplier => {
    const price = Math.round(basePrice * multiplier)
    const value = holdings * price
    const gainLoss = value - investmentCost
    const percentage = investmentCost > 0 ? (gainLoss / investmentCost) * 100 : 0
    
    scenarios.push({
      price,
      value,
      gainLoss,
      percentage
    })
  })
  
  multipleScenarios.value = scenarios
}

// 値の表示クラスを取得
const getValueClass = (value: number) => {
  if (value > 0) return 'text-positive'
  if (value < 0) return 'text-negative'
  return 'text-neutral'
}

// 数値フォーマット
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('ja-JP').format(num)
}

// パラメータが変更されたら結果をクリア
watch(() => simulationParams.value, () => {
  simulationResult.value = null
  comparisonData.value = []
  multipleScenarios.value = []
  showMultipleScenarios.value = false
}, { deep: true })
</script>

<style scoped>
.simulation-panel {
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 100%);
  color: white;
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-lg);
}

.simulation-panel__title {
  font-size: 1.5rem;
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.simulation-panel__form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.simulation-panel__result {
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  backdrop-filter: blur(10px);
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.result-item {
  text-align: center;
}

.result-label {
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: var(--spacing-xs);
}

.result-value {
  font-size: 1.25rem;
  font-weight: var(--font-weight-bold);
}

.scenario-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
}

.scenario-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-md);
  text-align: center;
}

.scenario-price {
  font-size: 1rem;
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-xs);
}

.scenario-value {
  font-size: 1.1rem;
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-xs);
}

.scenario-percentage {
  font-size: 0.875rem;
}

.text-primary {
  color: var(--color-primary-light) !important;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .simulation-panel__form {
    grid-template-columns: 1fr;
  }
  
  .result-grid {
    grid-template-columns: 1fr;
  }
  
  .scenario-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>