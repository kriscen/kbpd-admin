//通过vue-router插件实现路由配置
import { createRouter, createWebHistory } from "vue-router";
import { constantRoutes } from "./routes";

//创建路由器
const router = createRouter({
  //路由模式
  history: createWebHistory(),
  routes: constantRoutes,
  //滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0
    };
  }
});

export default router;
