import { createApp } from "vue"
import "./style.css"
import App from "./App.vue"
import { vTooltip } from "floating-vue"
import "floating-vue/dist/style.css"

const app = createApp(App)

app.directive("tooltip", vTooltip)

app.mount("#app")
