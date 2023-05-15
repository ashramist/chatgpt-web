import { createApp } from 'vue'
import App from './App.vue'
import { setupI18n } from './locales'
import { setupAssets, setupScrollbarStyle } from './plugins'
import { setupStore } from './store'
import { setupRouter } from './router'

const app = createApp(App)
setupStore(app)

setupAssets()

setupScrollbarStyle()

setupI18n(app)

setupRouter(app)

app.mount('#app')