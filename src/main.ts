import { createApp } from "vue";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";
import App from "@/App.vue";
import "virtual:svg-icons-register";
import gloablComponent from "@/components/index";
import "@/styles/index.scss";
import router from "@/router";
import { createPinia } from "pinia";

const pinia = createPinia();

const app = createApp(App);
app.use(ElementPlus, {
  locale: zhCn
});
app.use(gloablComponent);
app.use(router);
app.use(pinia);
app.mount("#app");
