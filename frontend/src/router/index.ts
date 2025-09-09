import { createRouter, createWebHistory } from 'vue-router'
import TransactionView from '@/views/TransactionView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'transactions',
      component: TransactionView
    }
  ]
})

export default router