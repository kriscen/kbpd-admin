import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
  type NavigationGuardNext
} from "vue-router";
import { constantRoutes } from "./routes";
import { ElMessage } from "element-plus";
import {
  isWhiteList,
  hasRoutePermission,
  getRedirectUrl
} from "@/utils/routePermission";

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

// 获取用户信息
const getUserInfoFromStorage = () => {
  try {
    const userInfo = localStorage.getItem("user-info");
    return userInfo ? JSON.parse(userInfo) : null;
  } catch {
    return null;
  }
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
    const userInfo = getUserInfoFromStorage();

    // 设置页面标题
    if (to.meta?.title) {
      document.title = `${to.meta.title} - 后台管理系统`;
    }

    // 检查是否为白名单路由
    if (isWhiteList(to.path)) {
      if (isLoggedIn && to.path === "/login") {
        // 已登录且访问登录页，跳转到首页
        next("/home");
      } else {
        // 白名单路由，允许访问
        next();
      }
      return;
    }

    // 检查路由是否需要认证
    const requiresAuth = to.meta?.requiresAuth !== false; // 默认需要认证

    if (requiresAuth) {
      if (isLoggedIn) {
        // 已登录，检查权限
        if (userInfo && userInfo.roles) {
          if (hasRoutePermission(to.path, userInfo.roles)) {
            // 有权限，允许访问
            next();
          } else {
            // 无权限，跳转到403或首页
            ElMessage.error("无权访问该页面");
            next("/home");
          }
        } else {
          // 没有用户信息，允许访问（由布局组件去获取用户信息）
          next();
        }
      } else {
        // 未登录，跳转到登录页
        ElMessage.warning("请先登录");
        next(getRedirectUrl(to.fullPath));
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
