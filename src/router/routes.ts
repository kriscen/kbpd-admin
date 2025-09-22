//对外暴露配置的常量路由
export const constantRoutes = [
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
      }
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
    //404
    path: "/404",
    component: () => import("@/views/404/index.vue"),
    name: "404",
    meta: {
      title: "页面不存在",
      requiresAuth: false
    }
  },
  {
    //任意路由
    path: "/:pathMatch(.*)*",
    redirect: "/404",
    name: "any"
  }
];
