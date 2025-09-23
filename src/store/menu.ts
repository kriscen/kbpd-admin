import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { RouteRecordRaw } from "vue-router";
import type { MenuItem } from "@/layout/types";
import { reqMenuList } from "@/api/sys/menu";
import type { MenuInfo } from "@/api/sys/menu/type";
import { ElMessage } from "element-plus";

export const useMenuStore = defineStore("menu", () => {
  // 状态定义
  const menuList = ref<MenuInfo[]>([]);
  const menuRoutes = ref<RouteRecordRaw[]>([]);
  const isMenuLoaded = ref(false);

  // 计算属性
  const getMenuList = computed(() => menuList.value);
  const getMenuRoutes = computed(() => menuRoutes.value);
  const getIsMenuLoaded = computed(() => isMenuLoaded.value);

  // 将后端菜单数据转换为路由配置
  const transformMenuToRoute = (menu: MenuInfo): RouteRecordRaw => {
    const route: any = {
      path: menu.path,
      name: menu.name,
      meta: menu.meta
    };

    // 临时使用home组件
    route.component = () => import("@/views/home/index.vue");

    // 处理重定向
    if (menu.redirect) {
      route.redirect = menu.redirect;
    }

    // 递归处理子菜单
    if (menu.children && menu.children.length > 0) {
      route.children = menu.children.map(child => transformMenuToRoute(child));
    }

    return route as RouteRecordRaw;
  };

  // 将菜单数据转换为侧边栏菜单项
  const transformMenuToMenuItem = (menu: MenuInfo): MenuItem => {
    const menuItem: MenuItem = {
      path: menu.path,
      name: menu.name,
      meta: menu.meta
    };

    // 递归处理子菜单
    if (menu.children && menu.children.length > 0) {
      menuItem.children = menu.children
        .filter(child => !child.meta.hidden)
        .map(child => transformMenuToMenuItem(child));
    }

    return menuItem;
  };

  // 获取用户菜单列表
  const fetchMenuList = async () => {
    try {
      // 检查token是否存在
      const token = localStorage.getItem("user-token");
      if (!token) {
        console.error("获取菜单失败: 用户未登录，token不存在");
        ElMessage.error("用户未登录，请先登录");
        throw new Error("用户未登录");
      }

      console.log("开始获取菜单列表，token:", token);
      const result = await reqMenuList();
      console.log("菜单API返回结果:", result);

      // 检查返回结果的类型
      if (typeof result === "string") {
        console.error(
          "API返回了HTML而不是JSON:",
          (result as string).substring(0, 200)
        );
        throw new Error("API返回了HTML页面，可能是Mock服务未正确工作");
      }

      if (result && result.code === 200) {
        menuList.value = result.data;
        console.log("菜单数据加载成功:", result.data);

        // 转换为路由配置
        menuRoutes.value = menuList.value.map(menu =>
          transformMenuToRoute(menu)
        );

        isMenuLoaded.value = true;
        return { success: true, data: result.data };
      } else {
        console.error("获取菜单失败，API返回错误:", result);
        const errorMessage =
          (result.data as any)?.message ||
          result.message ||
          `API返回错误码: ${result.code}`;
        ElMessage.error(errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error("获取菜单失败，异常信息:", error);
      const errorMessage = error instanceof Error ? error.message : "网络错误";
      ElMessage.error(`获取菜单失败: ${errorMessage}`);
      return { success: false, message: errorMessage };
    }
  };

  // 获取侧边栏菜单数据
  const getSidebarMenus = computed(() => {
    return menuList.value
      .filter(menu => !menu.meta.hidden)
      .map(menu => transformMenuToMenuItem(menu));
  });

  // 根据路径查找菜单
  const findMenuByPath = (path: string): MenuInfo | null => {
    const findInMenus = (menus: MenuInfo[]): MenuInfo | null => {
      for (const menu of menus) {
        if (menu.path === path) {
          return menu;
        }
        if (menu.children && menu.children.length > 0) {
          const found = findInMenus(menu.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findInMenus(menuList.value);
  };

  // 检查用户是否有访问某个菜单的权限
  const hasMenuPermission = (menuPath: string): boolean => {
    try {
      const userInfo = localStorage.getItem("user-info");
      const userRoles = userInfo ? JSON.parse(userInfo).roles || [] : [];
      const menu = findMenuByPath(menuPath);

      if (!menu) return false;
      if (!menu.meta.roles || menu.meta.roles.length === 0) return true;

      return menu.meta.roles.some(role => userRoles.includes(role));
    } catch {
      return false;
    }
  };

  // 获取面包屑导航
  const getBreadcrumbs = (path: string) => {
    const breadcrumbs: { title: string; path: string }[] = [];

    const findPath = (
      menus: MenuInfo[],
      targetPath: string,
      currentPath: MenuItem[] = []
    ): boolean => {
      for (const menu of menus) {
        const newPath = [
          ...currentPath,
          { path: menu.path, name: menu.name, meta: menu.meta }
        ];

        if (menu.path === targetPath) {
          breadcrumbs.push(
            ...newPath.map(item => ({
              title: item.meta?.title || item.name,
              path: item.path
            }))
          );
          return true;
        }

        if (menu.children && menu.children.length > 0) {
          if (findPath(menu.children, targetPath, newPath)) {
            return true;
          }
        }
      }
      return false;
    };

    findPath(menuList.value, path);
    return breadcrumbs;
  };

  // 清空菜单数据
  const clearMenuData = () => {
    menuList.value = [];
    menuRoutes.value = [];
    isMenuLoaded.value = false;
  };

  // 重新加载菜单
  const reloadMenu = async () => {
    clearMenuData();
    return await fetchMenuList();
  };

  return {
    // 状态
    menuList: getMenuList,
    menuRoutes: getMenuRoutes,
    isMenuLoaded: getIsMenuLoaded,
    sidebarMenus: getSidebarMenus,

    // 方法
    fetchMenuList,
    findMenuByPath,
    hasMenuPermission,
    getBreadcrumbs,
    clearMenuData,
    reloadMenu
  };
});
