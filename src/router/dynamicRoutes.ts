import type { RouteRecordRaw } from "vue-router";

/**
 * 动态路由配置
 * 这里定义所有可能的路由组件，用于根据后端菜单数据动态生成路由
 */
export const dynamicRoutes: RouteRecordRaw[] = [
  // 首页
  {
    path: "/home",
    name: "Home",
    component: () => import("@/views/home/index.vue"),
    meta: {
      title: "首页",
      icon: "HomeFilled",
      affix: true,
      requiresAuth: true
    }
  },

  // 系统管理
  {
    path: "/system",
    name: "System",
    component: () => import("@/layout/example.vue"), // 使用example作为容器
    redirect: "/system/user",
    meta: {
      title: "系统管理",
      icon: "Setting",
      requiresAuth: true
    },
    children: []
  },
  {
    path: "/system/user",
    name: "SystemUser",
    component: () => import("@/views/home/index.vue"), // 临时使用home组件
    meta: {
      title: "用户管理",
      icon: "User",
      requiresAuth: true,
      keepAlive: true
    }
  },
  {
    path: "/system/role",
    name: "SystemRole",
    component: () => import("@/views/home/index.vue"), // 临时使用home组件
    meta: {
      title: "角色管理",
      icon: "UserFilled",
      requiresAuth: true,
      keepAlive: true
    }
  },
  {
    path: "/system/menu",
    name: "SystemMenu",
    component: () => import("@/views/home/index.vue"), // 临时使用home组件
    meta: {
      title: "菜单管理",
      icon: "Menu",
      requiresAuth: true,
      keepAlive: true
    }
  },

  // 内容管理
  {
    path: "/content",
    name: "Content",
    component: () => import("@/layout/example.vue"),
    redirect: "/content/article",
    meta: {
      title: "内容管理",
      icon: "Document",
      requiresAuth: true
    },
    children: []
  },
  {
    path: "/content/article",
    name: "ContentArticle",
    component: () => import("@/views/home/index.vue"), // 临时使用home组件
    meta: {
      title: "文章管理",
      icon: "Edit",
      requiresAuth: true,
      keepAlive: true
    }
  },
  {
    path: "/content/category",
    name: "ContentCategory",
    component: () => import("@/views/home/index.vue"), // 临时使用home组件
    meta: {
      title: "分类管理",
      icon: "FolderOpened",
      requiresAuth: true,
      keepAlive: true
    }
  },

  // 系统工具
  {
    path: "/tools",
    name: "Tools",
    component: () => import("@/layout/example.vue"),
    redirect: "/tools/generator",
    meta: {
      title: "系统工具",
      icon: "Operation",
      requiresAuth: true
    },
    children: []
  },
  {
    path: "/tools/generator",
    name: "ToolsGenerator",
    component: () => import("@/views/home/index.vue"), // 临时使用home组件
    meta: {
      title: "代码生成",
      icon: "Cpu",
      requiresAuth: true,
      keepAlive: true
    }
  },
  {
    path: "/tools/swagger",
    name: "ToolsSwagger",
    component: () => import("@/views/home/index.vue"), // 临时使用home组件
    meta: {
      title: "接口文档",
      icon: "Document",
      requiresAuth: true,
      keepAlive: true
    }
  },

  // 系统监控
  {
    path: "/monitor",
    name: "Monitor",
    component: () => import("@/layout/example.vue"),
    redirect: "/monitor/server",
    meta: {
      title: "系统监控",
      icon: "Monitor",
      requiresAuth: true
    },
    children: []
  },
  {
    path: "/monitor/server",
    name: "MonitorServer",
    component: () => import("@/views/home/index.vue"), // 临时使用home组件
    meta: {
      title: "服务监控",
      icon: "Platform",
      requiresAuth: true,
      keepAlive: true
    }
  },
  {
    path: "/monitor/log",
    name: "MonitorLog",
    component: () => import("@/views/home/index.vue"), // 临时使用home组件
    meta: {
      title: "日志监控",
      icon: "Warning",
      requiresAuth: true,
      keepAlive: true
    }
  }
];

/**
 * 根据路由名称查找动态路由
 */
export function findDynamicRoute(name: string): RouteRecordRaw | undefined {
  return dynamicRoutes.find(route => route.name === name);
}

/**
 * 获取所有动态路由名称
 */
export function getDynamicRouteNames(): string[] {
  return dynamicRoutes.map(route => route.name as string);
}
