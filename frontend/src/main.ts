import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify styles - 最優先で読み込み
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

// Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'
import router from './router'

// カスタムスタイルは最後
import './styles/main.scss'

// Vuetifyインスタンス作成
const vuetify = createVuetify({
  components,
  directives,
  ssr: false,
  theme: {
    defaultTheme: 'light',
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')