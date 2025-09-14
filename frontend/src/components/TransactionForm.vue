<template>
  <TransactionFormWrapper
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @transaction-added="$emit('transaction-added')"
  />
</template>

<script setup lang="ts">
import TransactionFormWrapper from './TransactionFormWrapper.vue'

interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'transaction-added'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
/* スタイルはwrapperコンポーネントで管理 */
</style>