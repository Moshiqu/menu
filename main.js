import App from './App'
import { createPinia } from 'pinia'
import { createUnistorage } from '@/uni_modules/pinia-plugin-unistorage'


const pinia = createPinia()
pinia.use(createUnistorage())

// // #ifndef VUE3
// import Vue from 'vue'
// import './uni.promisify.adaptor'
// Vue.config.productionTip = false
// App.mpType = 'app'
// const app = new Vue({
//     ...App
// })
// app.$mount()
// // #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
    const app = createSSRApp(App)
    app.use(pinia)

    return {
        app,
        pinia
    }
}
// #endif

