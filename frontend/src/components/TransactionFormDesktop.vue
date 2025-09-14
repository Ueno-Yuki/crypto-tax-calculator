<template>
  <v-dialog v-model="dialog" max-width="700px" persistent>
    <v-card>
      <v-card-title class="text-h5 pa-6">
        <v-icon class="me-3">mdi-plus-circle</v-icon>
        取引追加
      </v-card-title>
      
      <v-divider />
      
      <v-card-text class="pa-6">
        <v-form ref="form" v-model="valid">
          <!-- 取引種別と仮想通貨 -->
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.type"
                :items="transactionTypes"
                label="取引種別 *"
                :rules="[rules.required]"
                variant="outlined"
                required
                prepend-inner-icon="mdi-swap-horizontal"
              />
            </v-col>
            
            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="formData.symbol"
                :items="cryptoCurrencyOptions"
                item-title="displayText"
                item-value="symbol"
                label="仮想通貨シンボル *"
                placeholder="通貨を選択または検索..."
                :rules="[rules.required]"
                variant="outlined"
                required
                clearable
                prepend-inner-icon="mdi-currency-sign"
              >
                <template #item="{ item, props }">
                  <v-list-item v-bind="props">
                    <template #prepend>
                      <v-avatar 
                        size="32" 
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
                      size="24" 
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
            </v-col>
          </v-row>
          
          <!-- 数量と価格 -->
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.amount"
                label="数量 *"
                :rules="[rules.required, rules.positiveNumber]"
                placeholder="例: 0.5, 0.00000001"
                variant="outlined"
                required
                inputmode="decimal"
                prepend-inner-icon="mdi-calculator"
                @blur="handleBlur($event, 'amount')"
              />
            </v-col>
            
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.priceJpy"
                label="価格 (JPY)"
                :rules="[rules.positiveNumber]"
                placeholder="例: 5000000"
                variant="outlined"
                inputmode="decimal"
                prepend-inner-icon="mdi-currency-jpy"
                @blur="handleBlur($event, 'priceJpy')"
              />
            </v-col>
          </v-row>
          
          <!-- 取引日時と取引所 -->
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.transactionDate"
                label="取引日時 *"
                type="datetime-local"
                :rules="[rules.required]"
                variant="outlined"
                required
                prepend-inner-icon="mdi-calendar-clock"
              />
            </v-col>
            
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.exchange"
                label="取引所"
                placeholder="例: Coincheck, Binance"
                variant="outlined"
                prepend-inner-icon="mdi-bank"
              />
            </v-col>
          </v-row>
          
          <!-- メモ -->
          <v-row>
            <v-col cols="12">
              <v-textarea
                v-model="formData.notes"
                label="メモ"
                rows="3"
                placeholder="追加情報があれば記入してください"
                variant="outlined"
                prepend-inner-icon="mdi-note-text"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      
      <v-divider />
      
      <v-card-actions class="pa-6">
        <v-spacer />
        <v-btn 
          color="grey" 
          variant="text" 
          size="large"
          @click="closeDialog"
          class="me-3"
        >
          キャンセル
        </v-btn>
        <v-btn 
          color="primary" 
          variant="elevated"
          size="large"
          @click="handleSubmit"
          :loading="loading"
          :disabled="!valid"
          prepend-icon="mdi-check"
        >
          追加
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
.v-card-title {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-bottom: 1px solid #e0e0e0;
}

.v-card-actions {
  background-color: #fafafa;
}

/* 数値入力フィールドのスタイル */
.v-text-field input[inputmode="decimal"] {
  font-variant-numeric: tabular-nums;
  font-weight: 500;
}
</style>