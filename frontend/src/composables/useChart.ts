// TradingView Lightweight Charts用のComposable

import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { 
  createChart,
  ColorType
} from 'lightweight-charts'
import type { 
  IChartApi, 
  ISeriesApi,
  LineData,
  Time,
  ChartOptions,
  DeepPartial
} from 'lightweight-charts'
import type { ChartDataPoint, TimeSeriesData } from '@/types/api/portfolio'
import { DEFAULT_CHART_OPTIONS } from '@/constants/crypto'

export interface UseChartOptions {
  width?: number
  height?: number
  theme?: 'light' | 'dark'
  showTimeScale?: boolean
  showPriceScale?: boolean
}

export function useChart(options: UseChartOptions = {}) {
  const chartContainer = ref<HTMLElement>()
  const chart = ref<IChartApi>()
  const lineSeries = ref<ISeriesApi<'Line'>>()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const defaultOptions: DeepPartial<ChartOptions> = {
    ...DEFAULT_CHART_OPTIONS,
    width: options.width || 800,
    height: options.height || 400,
    layout: {
      background: {
        type: ColorType.Solid,
        color: options.theme === 'dark' ? '#1e1e1e' : '#ffffff'
      },
      textColor: options.theme === 'dark' ? '#d1d4dc' : '#333333'
    },
    grid: {
      vertLines: {
        color: options.theme === 'dark' ? '#2c2c2c' : '#e1e1e1'
      },
      horzLines: {
        color: options.theme === 'dark' ? '#2c2c2c' : '#e1e1e1'
      }
    },
    timeScale: {
      visible: options.showTimeScale !== false,
      borderColor: options.theme === 'dark' ? '#2c2c2c' : '#cccccc'
    },
    rightPriceScale: {
      visible: options.showPriceScale !== false,
      borderColor: options.theme === 'dark' ? '#2c2c2c' : '#cccccc'
    }
  }

  // チャートの初期化
  const initChart = async () => {
    if (!chartContainer.value) return

    try {
      loading.value = true
      error.value = null

      chart.value = createChart(chartContainer.value, defaultOptions)
      
      // ラインシリーズを追加
      lineSeries.value = chart.value.addLineSeries({
        color: '#2196F3',
        lineWidth: 2,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 6,
        lastValueVisible: true,
        priceLineVisible: true
      })

      // レスポンシブ対応
      const resizeObserver = new ResizeObserver(() => {
        if (chart.value && chartContainer.value) {
          chart.value.applyOptions({
            width: chartContainer.value.clientWidth,
            height: chartContainer.value.clientHeight
          })
        }
      })

      resizeObserver.observe(chartContainer.value)

    } catch (err) {
      error.value = 'チャートの初期化に失敗しました'
      console.error('Chart initialization error:', err)
    } finally {
      loading.value = false
    }
  }

  // データを設定
  const setData = (data: ChartDataPoint[]) => {
    if (!lineSeries.value || !data.length) return

    try {
      const formattedData: LineData[] = data.map(point => ({
        time: typeof point.time === 'string' ? point.time : point.time as Time,
        value: point.value
      }))

      lineSeries.value.setData(formattedData)
      
      // チャートを最新データに合わせてフィット
      chart.value?.timeScale().fitContent()
      
    } catch (err) {
      error.value = 'データの設定に失敗しました'
      console.error('Chart data error:', err)
    }
  }

  // データを追加（リアルタイム更新用）
  const updateData = (point: ChartDataPoint) => {
    if (!lineSeries.value) return

    try {
      const formattedPoint: LineData = {
        time: typeof point.time === 'string' ? point.time : point.time as Time,
        value: point.value
      }

      lineSeries.value.update(formattedPoint)
    } catch (err) {
      error.value = 'データの更新に失敗しました'
      console.error('Chart update error:', err)
    }
  }

  // 時系列データから資産推移チャートを作成
  const setPortfolioData = (timeSeriesData: TimeSeriesData) => {
    setData(timeSeriesData.data)
  }

  // チャートのサイズを更新
  const resize = () => {
    if (chart.value && chartContainer.value) {
      chart.value.applyOptions({
        width: chartContainer.value.clientWidth,
        height: chartContainer.value.clientHeight
      })
    }
  }

  // チャートのテーマを変更
  const setTheme = (theme: 'light' | 'dark') => {
    if (!chart.value) return

    const themeOptions: DeepPartial<ChartOptions> = {
      layout: {
        background: {
          type: ColorType.Solid,
          color: theme === 'dark' ? '#1e1e1e' : '#ffffff'
        },
        textColor: theme === 'dark' ? '#d1d4dc' : '#333333'
      },
      grid: {
        vertLines: {
          color: theme === 'dark' ? '#2c2c2c' : '#e1e1e1'
        },
        horzLines: {
          color: theme === 'dark' ? '#2c2c2c' : '#e1e1e1'
        }
      }
    }

    chart.value.applyOptions(themeOptions)
  }

  // マウント時にチャートを初期化
  onMounted(async () => {
    await nextTick()
    initChart()
  })

  // アンマウント時にチャートを破棄
  onUnmounted(() => {
    if (chart.value) {
      chart.value.remove()
    }
  })

  return {
    // Refs
    chartContainer,
    loading,
    error,

    // Methods
    initChart,
    setData,
    updateData,
    setPortfolioData,
    resize,
    setTheme,

    // Chart instance (for advanced usage)
    chart,
    lineSeries
  }
}