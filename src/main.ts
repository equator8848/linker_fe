import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import HttpUtil from '@/common/HttpUtil'
import {VueClipboard} from "@soerenmartius/vue3-clipboard"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import eventBus from 'vue3-eventbus'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(VueClipboard)
app.use(ElementPlus)
app.config.globalProperties.$httpUtil = HttpUtil;
app.config.globalProperties.$storage = store;
app.use(eventBus)


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
const vm = app.mount('#app')
