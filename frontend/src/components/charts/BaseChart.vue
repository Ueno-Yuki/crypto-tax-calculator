<template>
  <div class="chart-container">
    <div v-if="title" class="chart-container__header">
      <h3>{{ title }}</h3>
      <div class="chart-actions">
        <div v-if="showTimeframeSelector" class="timeframe-buttons">
          <v-btn
            v-for="timeframe in timeframes"
            :key="timeframe.value"
            :variant="selectedTimeframe === timeframe.value ? 'elevated' : 'outlined'"
            size="small"
            @click="selectTimeframe(timeframe.value)"
          >
            {{ timeframe.label }}
          </v-btn>
        </div>
        
        <v-btn
          v-if="showFullscreen"
          icon="mdi-fullscreen"
          variant="text"
          size="small"
          @click="toggleFullscreen"
        />
      </div>
    </div>
    
    <div class="chart-container__content">
      <div 
        ref="chartContainer" 
        class="chart-canvas"
        :style="chartStyle"
      ></div>
      
      <div v-if="loading" class="chart-loading">
        <v-progress-circular 
          indeterminate 
          color="primary"
          size="48"
        />
        <div class="mt-2">チャートを読み込み中...</div>
      </div>
      
      <v-alert 
        v-if="error" 
        type="error" 
        variant="tonal"
        class="chart-error"
      >
        {{ error }}
        <template #append>
          <v-btn 
            variant="text" 
            size="small"
            @click="retry"
          >
            再試行
          </v-btn>
        </template>
      </v-alert>
      
      <div v-if="showNoData" class="chart-no-data">
        <v-icon size="48" color="grey-lighten-1">mdi-chart-line</v-icon>
        <div class="mt-2">表示するデータがありません</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useChart } from '@/composables/useChart'
import type { ChartDataPoint } from '@/types/api/portfolio'

interface Props {
  title?: string
  data?: ChartDataPoint[]
  height?: number
  theme?: 'light' | 'dark'
  showTimeframeSelector?: boolean
  showFullscreen?: boolean
  loading?: boolean
}

interface Emits {
  (e: 'timeframe-change', timeframe: string): void
  (e: 'fullscreen', enabled: boolean): void
  (e: 'retry'): void
}

const props = withDefaults(defineProps<Props>(), {
  height: 400,
  theme: 'light',
  showTimeframeSelector: false,
  showFullscreen: false,
  loading: false
})

const emit = defineEmits<Emits>()

// Internal state
const selectedTimeframe = ref('1d')
const isFullscreen = ref(false)

// Predefined timeframes (avoiding external imports)
const timeframes = [
  { value: '1d', label: '1日' },
  { value: '7d', label: '1週間' },
  { value: '30d', label: '1ヶ月' },
  { value: '90d', label: '3ヶ月' },
  { value: '1y', label: '1年' }
]

// Chart composable
const {
  chartContainer,
  loading: chartLoading,
  error,
  setData
} = useChart({
  height: props.height,
  theme: props.theme
})

// Computed properties
const chartStyle = computed(() => ({
  height: `${props.height}px`,
  minHeight: `${props.height}px`
}))

const showNoData = computed(() => {
  return !props.loading && 
         !chartLoading.value && 
         !error.value && 
         (!props.data || props.data.length === 0)
})

// Methods
const selectTimeframe = (timeframe: string) => {
  selectedTimeframe.value = timeframe
  emit('timeframe-change', timeframe)
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  emit('fullscreen', isFullscreen.value)
}

const retry = () => {
  emit('retry')
}

// Watch for data changes
import { watch } from 'vue'

watch(() => props.data, (newData) => {
  if (newData && newData.length > 0) {
    setData(newData)
  }
}, { deep: true })
</script>

<style scoped>
.chart-container {
  background: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.chart-container__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-surface-variant);
  background: var(--color-surface);
}

.chart-container__header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: var(--font-weight-medium);
  color: var(--color-on-surface);
}

.chart-actions {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.timeframe-buttons {
  display: flex;
  gap: 4px;
}

.chart-container__content {
  position: relative;
  padding: var(--spacing-md);
}

.chart-canvas {
  width: 100%;
  position: relative;
}

.chart-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  color: var(--color-on-surface-variant);
  font-size: 0.875rem;
}

.chart-error {
  margin: var(--spacing-lg) 0;
}

.chart-no-data {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-on-surface-variant);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .chart-container__header {
    flex-direction: column;
    gap: var(--spacing-sm);
    align-items: stretch;
  }
  
  .chart-actions {
    justify-content: center;
  }
}
</style>