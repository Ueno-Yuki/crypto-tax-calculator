<template>
  <!-- デスクトップ版 -->
  <TransactionFormDesktop
    v-if="isDesktop"
    :model-value="modelValue"
    @update:model-value="updateModelValue"
    @transaction-added="handleTransactionAdded"
  />
  
  <!-- モバイル・タブレット版 -->
  <TransactionFormMobile
    v-else
    :model-value="modelValue"
    @update:model-value="updateModelValue"
    @transaction-added="handleTransactionAdded"
  />
</template>

<script setup lang="ts">
import { useDeviceDetection } from '@/composables/useDeviceDetection'
import TransactionFormDesktop from './TransactionFormDesktop.vue'
import TransactionFormMobile from './TransactionFormMobile.vue'

interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'transaction-added'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// デバイス検出
const { isDesktop, isTouchDevice, deviceType, breakpoint } = useDeviceDetection()

// イベントハンドラー
const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value)
}

const handleTransactionAdded = () => {
  emit('transaction-added')
}

// 開発用ログ（本番では削除）
if (import.meta.env.DEV) {
  console.log('Device detection:', {
    deviceType: deviceType.value,
    breakpoint: breakpoint.value,
    isDesktop: isDesktop.value,
    isTouchDevice: isTouchDevice.value
  })
}
</script>

<style scoped>
/* このコンポーネント自体にはスタイルは不要 */
/* 子コンポーネントで個別にスタイリングしている */
</style>