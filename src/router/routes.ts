import type { RouteRecordRaw } from "vue-router";

//对外暴露配置的常量路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    //登录
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    name: "login", //命名路由
    meta: {
      title: "登录",
      requiresAuth: false
    }
  },
  {
    //OAuth2认证回调页面
    path: "/auth/callback",
    component: () => import("@/views/login/index.vue"),
    name: "oauth2Callback",
    meta: {
      title: "OAuth2认证回调",
      requiresAuth: false
    }
  },
  {
    //布局主框架
    path: "/",
    component: () => import("@/layout/index.vue"),
    redirect: "/home",
    children: [
      {
        path: "home",
        component: () => import("@/views/home/index.vue"),
        name: "Home",
        meta: {
          title: "首页",
          icon: "HomeFilled",
          requiresAuth: true,
          affix: true
        }
      },
      {
        path: "debug",
        component: () => import("@/views/debug/index.vue"),
        name: "Debug",
        meta: {
          title: "调试页面",
          icon: "Setting",
          requiresAuth: true
        }
      },
      {
        path: "404-content",
        component: () => import("@/views/404/content.vue"),
        name: "404Content",
        meta: {
          title: "页面不存在",
          requiresAuth: false,
          hidden: true
        }
      }
      // 动态路由将在这里添加
    ]
  },
  {
    //重定向页面
    path: "/redirect",
    component: () => import("@/layout/index.vue"),
    meta: {
      hidden: true
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/layout/redirect.vue")
      }
    ]
  },
  {
    //404 - 独立页面（用于直接访问 /404）
    path: "/404",
    component: () => import("@/views/404/index.vue"),
    name: "404",
    meta: {
      title: "页面不存在",
      requiresAuth: false
    }
  },
  {
    //任意路由 - 跳转到主布局内的404页面
    path: "/:pathMatch(.*)*",
    redirect: to => {
      // 如果是直接访问不存在的路由，跳转到主布局内的404
      return "/404-content";
    },
    name: "any"
  }
];
