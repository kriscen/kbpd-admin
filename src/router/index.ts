//通过vue-router插件实现路由配置
import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
  type NavigationGuardNext
} from "vue-router";
import { constantRoutes } from "./routes";
import { ElMessage } from "element-plus";

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

// 路由守卫
// 为了避免循环依赖，这里直接使用localStorage
const getTokenFromStorage = () => {
  return localStorage.getItem("user-token") || "";
};

// 全局前置守卫
router.beforeEach(
  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const token = getTokenFromStorage();
    const isLoggedIn = !!token;

    // 设置页面标题
    if (to.meta?.title) {
      document.title = `${to.meta.title} - 后台管理系统`;
    }

    // 如果访问的是登录页面
    if (to.path === "/login" || to.path === "/auth/callback") {
      if (isLoggedIn && to.path === "/login") {
        // 已登录且访问登录页，跳转到首页
        next("/home");
      } else {
        // 未登录或OAuth2回调，允许访问
        next();
      }
      return;
    }

    // 检查路由是否需要认证
    const requiresAuth = to.meta?.requiresAuth !== false; // 默认需要认证

    if (requiresAuth) {
      if (isLoggedIn) {
        // 已登录，允许访问
        next();
      } else {
        // 未登录，跳转到登录页
        ElMessage.warning("请先登录");
        next({
          path: "/login",
          query: { redirect: to.fullPath } // 保存目标路由
        });
      }
    } else {
      // 不需要认证，直接访问
      next();
    }
  }
);

// 全局后置守卫
router.afterEach((to: RouteLocationNormalized) => {
  // 可以在这里做一些全局的后置处理，比如埋点、加载结束等
  console.log(`导航到: ${to.path}`);
});

export default router;
