<template>
  <SimpleChart
    :title="title"
    :data="chartData"
    :height="height"
    :loading="loading"
  >
    <!-- 追加の統計情報 -->
    <template v-if="portfolioStats">
      <div class="portfolio-stats">
        <div class="stat-item">
          <div class="stat-label">現在の資産価値</div>
          <div class="stat-value" :class="getValueClass(portfolioStats.currentValue)">
            ¥{{ formatNumber(portfolioStats.currentValue) }}
          </div>
        </div>
        
        <div class="stat-item">
          <div class="stat-label">投資元本</div>
          <div class="stat-value text-neutral">
            ¥{{ formatNumber(portfolioStats.totalInvestment) }}
          </div>
        </div>
        
        <div class="stat-item">
          <div class="stat-label">損益</div>
          <div class="stat-value" :class="getValueClass(portfolioStats.totalGainLoss)">
            {{ portfolioStats.totalGainLoss >= 0 ? '+' : '' }}¥{{ formatNumber(portfolioStats.totalGainLoss) }}
            <span class="stat-percentage">
              ({{ portfolioStats.gainLossPercentage >= 0 ? '+' : '' }}{{ portfolioStats.gainLossPercentage.toFixed(2) }}%)
            </span>
          </div>
        </div>
      </div>
    </template>
  </SimpleChart>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import SimpleChart from './SimpleChart.vue'
import { usePortfolio } from '@/composables/usePortfolio'
import type { ChartDataPoint } from '@/types/api/portfolio'
import dayjs from 'dayjs'

interface Props {
  title?: string
  height?: number
  theme?: 'light' | 'dark'
  dateRange?: {
    start: string
    end: string
  }
}

interface PortfolioStats {
  currentValue: number
  totalInvestment: number
  totalGainLoss: number
  gainLossPercentage: number
}

const props = withDefaults(defineProps<Props>(), {
  title: 'ポートフォリオ推移',
  height: 400,
  theme: 'light'
})

const loading = ref(false)
// const selectedTimeframe = ref('30d') // 将来の実装用
const chartData = ref<ChartDataPoint[]>([])

const {
  currentHoldings,
  totalPortfolioValue,
  totalInvestment,
  totalGainLoss,
  totalGainLossPercentage
} = usePortfolio()

// ポートフォリオ統計情報
const portfolioStats = computed<PortfolioStats | null>(() => {
  if (currentHoldings.value.length === 0) return null
  
  return {
    currentValue: totalPortfolioValue.value,
    totalInvestment: totalInvestment.value,
    totalGainLoss: totalGainLoss.value,
    gainLossPercentage: totalGainLossPercentage.value
  }
})

// ポートフォリオデータの読み込み
const loadPortfolioData = async () => {
  loading.value = true
  
  try {
    // 実際の実装では、日付範囲に基づいてデータを取得
    const endDate = props.dateRange?.end || dayjs().format('YYYY-MM-DD')
    const startDate = props.dateRange?.start || dayjs().subtract(30, 'days').format('YYYY-MM-DD')
    
    // サンプルデータ（実際はAPIから取得）
    const sampleData: ChartDataPoint[] = generateSamplePortfolioData(startDate, endDate)
    
    chartData.value = sampleData
    
  } catch (error) {
    console.error('Portfolio data loading error:', error)
  } finally {
    loading.value = false
  }
}

// サンプルデータ生成（実際の実装では削除）
const generateSamplePortfolioData = (startDate: string, endDate: string): ChartDataPoint[] => {
  const start = dayjs(startDate)
  const end = dayjs(endDate)
  const days = end.diff(start, 'days')
  const data: ChartDataPoint[] = []
  
  let baseValue = totalInvestment.value || 1000000 // 100万円スタート
  
  for (let i = 0; i <= days; i++) {
    const date = start.add(i, 'days')
    // ランダムな変動を追加（実際はトランザクション履歴から計算）
    const volatility = (Math.random() - 0.5) * 0.05 // ±2.5%の変動
    baseValue *= (1 + volatility)
    
    data.push({
      time: date.format('YYYY-MM-DD'),
      value: Math.round(baseValue)
    })
  }
  
  return data
}

// 時間軸変更のハンドラー（将来の実装用）
// const handleTimeframeChange = (timeframe: string) => {
//   selectedTimeframe.value = timeframe
//   
//   // 時間軸に応じて日付範囲を設定（将来の実装用）
//   switch (timeframe) {
//     case '1d':
//       // 1日のデータを取得
//       break
//     case '7d':
//       // 7日のデータを取得
//       break
//     case '30d':
//       // 30日のデータを取得
//       break
//     case '90d':
//       // 90日のデータを取得
//       break
//     case '1y':
//       // 1年のデータを取得
//       break
//     case 'all':
//       // 全期間のデータを取得
//       break
//   }
//   
//   // データを再読み込み
//   loadPortfolioData()
// }

// フルスクリーン切り替えのハンドラー（将来の実装用）
// const handleFullscreen = (enabled: boolean) => {
//   // フルスクリーン機能の実装（オプション）
//   console.log('Fullscreen:', enabled)
// }

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

// 保有資産が変更されたらチャートを更新
watch(() => currentHoldings.value, () => {
  loadPortfolioData()
}, { deep: true })

// マウント時にデータを読み込み
onMounted(() => {
  loadPortfolioData()
})
</script>

<style scoped>
.portfolio-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--color-surface-variant);
  border-radius: var(--border-radius-md);
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-on-surface-variant);
  margin-bottom: var(--spacing-xs);
}

.stat-value {
  font-size: 1.25rem;
  font-weight: var(--font-weight-bold);
}

.stat-percentage {
  font-size: 0.875rem;
  font-weight: var(--font-weight-medium);
  margin-left: var(--spacing-xs);
}

@media (max-width: 768px) {
  .portfolio-stats {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
}
</style>