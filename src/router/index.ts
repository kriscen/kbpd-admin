import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
  type NavigationGuardNext,
  type RouteRecordRaw
} from "vue-router";
import { constantRoutes } from "./routes";
import { dynamicRoutes } from "./dynamicRoutes";
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

// 动态路由添加状态
let routesAdded = false;

// 动态添加路由
export const addDynamicRoutes = (menuRoutes: RouteRecordRaw[]) => {
  if (routesAdded) {
    console.log("路由已添加，跳过重复添加");
    return;
  }

  // 获取主布局路由
  const mainRoute = router.getRoutes().find(route => route.path === "/");
  if (!mainRoute) {
    console.error("未找到主布局路由");
    return;
  }

  // 添加动态路由到主布局的children中
  menuRoutes.forEach(route => {
    // 如果是子路由，添加到主布局下
    if (!route.path.startsWith("/") || route.path === "/home") {
      return; // 跳过首页，已在constantRoutes中定义
    }

    try {
      router.addRoute("/", route);
      console.log(`添加路由: ${route.path}`);
    } catch (error) {
      console.error(`添加路由失败: ${route.path}`, error);
    }
  });

  routesAdded = true;
  console.log("动态路由添加完成");
};

// 清除动态路由
export const clearDynamicRoutes = () => {
  // 移除所有动态添加的路由
  const routes = router.getRoutes();
  routes.forEach(route => {
    // 如果路由在dynamicRoutes中定义且不是constantRoutes中的路由，则移除
    const isDynamic = dynamicRoutes.some(dr => dr.name === route.name);
    const isConstant = constantRoutes.some(cr => {
      if (cr.children) {
        return cr.children.some((child: any) => child.name === route.name);
      }
      return cr.name === route.name;
    });

    if (isDynamic && !isConstant && route.name !== "Home") {
      router.removeRoute(route.name!);
      console.log(`移除路由: ${route.path}`);
    }
  });

  routesAdded = false;
  console.log("动态路由清除完成");
};

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

    // 检查路由是否存在
    const matched = router.resolve(to.path);
    if (matched.name === "any" && to.path !== "/404-content") {
      // 不存在的路由，跳转到主布局内的404页面
      next("/404-content");
      return;
    }

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
