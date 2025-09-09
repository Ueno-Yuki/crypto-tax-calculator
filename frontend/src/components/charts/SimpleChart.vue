<template>
  <v-card class="mb-4">
    <v-card-title v-if="title">
      {{ title }}
    </v-card-title>
    
    <v-card-text>
      <div
        ref="chartContainer"
        :style="{ height: height + 'px', width: '100%' }"
      ></div>
      
      <div v-if="loading" class="text-center pa-4">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <div class="mt-2">チャートを読み込み中...</div>
      </div>
      
      <div v-else-if="!data || data.length === 0" class="text-center pa-4">
        <v-icon size="48" color="grey">mdi-chart-line</v-icon>
        <div class="mt-2">表示するデータがありません</div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useChart } from '@/composables/useChart'
import type { ChartDataPoint } from '@/types/api/portfolio'

interface Props {
  title?: string
  data?: ChartDataPoint[]
  height?: number
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: 400,
  loading: false
})

const chartContainer = ref<HTMLElement>()

const { setData } = useChart({
  height: props.height
})

watch(() => props.data, (newData) => {
  if (newData && newData.length > 0) {
    setData(newData)
  }
})

onMounted(() => {
  if (props.data && props.data.length > 0) {
    setData(props.data)
  }
})
</script>

<style scoped>
.v-card {
  background: var(--color-surface);
  border-radius: var(--border-radius-md);
}
</style>