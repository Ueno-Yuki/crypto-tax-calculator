<template>
  <v-app>
    <v-app-bar 
      color="primary" 
      app
    >
      <v-app-bar-title>
        <v-icon class="me-2">mdi-currency-btc</v-icon>
        仮想通貨確定申告支援アプリ
      </v-app-bar-title>
      
      <v-spacer></v-spacer>
      
      <v-btn 
        variant="text" 
        @click="clearData"
        prepend-icon="mdi-delete"
      >
        データクリア
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <v-footer app color="grey-lighten-3">
      <v-row justify="center" no-gutters>
        <v-col class="text-center" cols="12">
          <small>
            <v-icon size="small" class="me-1">mdi-shield-check</v-icon>
            プライバシー重視 - データは一切保存されません
          </small>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { useTransactionStore } from '@/stores/transaction'

const transactionStore = useTransactionStore()

const clearData = async () => {
  if (confirm('全てのデータを削除しますか？この操作は元に戻せません。')) {
    await transactionStore.clearAllData()
  }
}
</script>

<style scoped>
.v-app-bar-title {
  font-weight: bold;
}
</style>