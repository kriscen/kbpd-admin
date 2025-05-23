import { createApp } from "vue";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";
import App from "@/App.vue";
import "virtual:svg-icons-register";
import gloablComponent from "@/components/index";
import "@/styles/index.scss";

const app = createApp(App);
app.use(ElementPlus, {
  locale: zhCn
});
app.use(gloablComponent);
app.mount("#app");
