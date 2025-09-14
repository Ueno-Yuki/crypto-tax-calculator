<template>
  <v-bottom-sheet v-model="dialog" persistent>
    <v-card class="mobile-transaction-form">
      <!-- ヘッダー -->
      <v-card-title class="sticky-header">
        <div class="d-flex align-center justify-space-between w-100">
          <div class="d-flex align-center">
            <v-icon class="me-2" color="primary">mdi-plus-circle</v-icon>
            <span class="text-h6">取引追加</span>
          </div>
          <v-btn 
            icon="mdi-close" 
            variant="text" 
            size="small"
            @click="closeDialog"
          />
        </div>
      </v-card-title>

      <v-divider />

      <!-- コンテンツエリア -->
      <v-card-text class="pa-4 pb-safe">
        <v-form ref="form" v-model="valid">
          
          <!-- 取引種別 -->
          <div class="mb-4">
            <v-select
              v-model="formData.type"
              :items="transactionTypes"
              label="取引種別 *"
              :rules="[rules.required]"
              variant="filled"
              required
              prepend-inner-icon="mdi-swap-horizontal"
              density="comfortable"
            />
          </div>

          <!-- 仮想通貨選択 -->
          <div class="mb-4">
            <v-autocomplete
              v-model="formData.symbol"
              :items="cryptoCurrencyOptions"
              item-title="displayText"
              item-value="symbol"
              label="仮想通貨シンボル *"
              placeholder="通貨を選択または検索..."
              :rules="[rules.required]"
              variant="filled"
              required
              clearable
              prepend-inner-icon="mdi-currency-sign"
              density="comfortable"
            >
              <template #item="{ item, props }">
                <v-list-item v-bind="props">
                  <template #prepend>
                    <v-avatar 
                      size="28" 
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
          </div>

          <!-- 数量と価格 -->
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formData.amount"
                label="数量 *"
                :rules="[rules.required, rules.positiveNumber]"
                placeholder="例: 0.5"
                variant="filled"
                required
                inputmode="decimal"
                prepend-inner-icon="mdi-calculator"
                density="comfortable"
                @blur="handleBlur($event, 'amount')"
              />
            </v-col>
            
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formData.priceJpy"
                label="価格 (JPY)"
                :rules="[rules.positiveNumber]"
                placeholder="例: 5000000"
                variant="filled"
                inputmode="decimal"
                prepend-inner-icon="mdi-currency-jpy"
                density="comfortable"
                @blur="handleBlur($event, 'priceJpy')"
              />
            </v-col>
          </v-row>

          <!-- 取引日時 -->
          <div class="mb-4">
            <v-text-field
              v-model="formData.transactionDate"
              label="取引日時 *"
              type="datetime-local"
              :rules="[rules.required]"
              variant="filled"
              required
              prepend-inner-icon="mdi-calendar-clock"
              density="comfortable"
            />
          </div>

          <!-- 取引所 -->
          <div class="mb-4">
            <v-text-field
              v-model="formData.exchange"
              label="取引所"
              placeholder="例: Coincheck"
              variant="filled"
              prepend-inner-icon="mdi-bank"
              density="comfortable"
            />
          </div>

          <!-- メモ -->
          <div class="mb-4">
            <v-textarea
              v-model="formData.notes"
              label="メモ"
              rows="2"
              placeholder="追加情報があれば記入..."
              variant="filled"
              prepend-inner-icon="mdi-note-text"
              density="comfortable"
              auto-grow
            />
          </div>

        </v-form>
      </v-card-text>

      <!-- アクションボタン（底部固定） -->
      <div class="sticky-footer">
        <v-divider />
        <v-card-actions class="pa-4">
          <v-row dense>
            <v-col cols="6">
              <v-btn 
                color="grey" 
                variant="outlined"
                size="large"
                @click="closeDialog"
                block
              >
                キャンセル
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn 
                color="primary" 
                variant="elevated"
                size="large"
                @click="handleSubmit"
                :loading="loading"
                :disabled="!valid"
                prepend-icon="mdi-check"
                block
              >
                追加
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </div>

    </v-card>
  </v-bottom-sheet>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useTransactionForm } from '@/composables/useTransactionForm'

interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'transaction-added'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const {
  form,
  valid,
  formData,
  loading,
  transactionTypes,
  cryptoCurrencyOptions,
  rules,
  handleBlur,
  submitForm,
  resetForm
} = useTransactionForm()

const dialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    resetForm()
  }
})

const closeDialog = () => {
  dialog.value = false
  resetForm()
}

const handleSubmit = async () => {
  const success = await submitForm()
  if (success) {
    emit('transaction-added')
    closeDialog()
  }
}
</script>

<style scoped>
.mobile-transaction-form {
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  border-radius: 16px 16px 0 0 !important;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-bottom: 1px solid #e0e0e0;
  padding: 16px;
}

.sticky-footer {
  position: sticky;
  bottom: 0;
  z-index: 10;
  background: #ffffff;
  border-top: 1px solid #e0e0e0;
}

/* iOS SafeArea対応 */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0);
}

/* モバイル用の大きなタップターゲット */
.v-btn {
  min-height: 48px;
}

/* 数値入力フィールドのスタイル */
.v-text-field input[inputmode="decimal"] {
  font-variant-numeric: tabular-nums;
  font-weight: 500;
  font-size: 16px; /* iOSでズームを防ぐ */
}

/* フォームフィールドの間隔調整 */
.v-row.dense .v-col {
  padding: 4px 8px;
}

/* フィールドのフォーカス時の視覚的フィードバック向上 */
.v-text-field--focused,
.v-select--focused,
.v-autocomplete--focused {
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

/* モバイルでのスクロール改善 */
.v-card-text {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  flex: 1;
}
</style>