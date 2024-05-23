import App from './App'
import { createPinia } from 'pinia'
import { createUnistorage } from '@/uni_modules/pinia-plugin-unistorage'
import { createSSRApp } from 'vue'
import { formateTime } from '/utils/tool'

export function createApp() {
    const pinia = createPinia()
    pinia.use(createUnistorage())

    const app = createSSRApp(App)

    app.config.globalProperties.$formateTime = formateTime // 时间转换方法

    app.use(pinia)

    return {
        app,
        pinia
    }
}

