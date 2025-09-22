import { ref, computed, reactive } from "vue";
import type { AppState } from "@/layout/types";

// 应用状态
const appState = reactive<AppState>({
  device: "desktop",
  sidebar: {
    opened: true,
    withoutAnimation: false
  }
});

// 用户信息
const userInfo = ref({
  username: "Admin",
  avatar: "",
  roles: ["admin"]
});

export function useNav() {
  // 设备检测
  const checkDevice = () => {
    const rect = document.body.getBoundingClientRect();
    appState.device = rect.width < 768 ? "mobile" : "desktop";
  };

  // 切换侧边栏
  const toggleSideBar = () => {
    appState.sidebar.opened = !appState.sidebar.opened;
    appState.sidebar.withoutAnimation = false;
  };

  // 关闭侧边栏
  const closeSideBar = (withoutAnimation = false) => {
    appState.sidebar.opened = false;
    appState.sidebar.withoutAnimation = withoutAnimation;
  };

  // 打开侧边栏
  const openSideBar = (withoutAnimation = false) => {
    appState.sidebar.opened = true;
    appState.sidebar.withoutAnimation = withoutAnimation;
  };

  // 全屏功能
  const isFullscreen = ref(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      isFullscreen.value = true;
    } else {
      document.exitFullscreen();
      isFullscreen.value = false;
    }
  };

  // 监听全屏状态变化
  document.addEventListener("fullscreenchange", () => {
    isFullscreen.value = !!document.fullscreenElement;
  });

  // 退出登录
  const logout = () => {
    // 清除用户信息和token
    userInfo.value = {
      username: "",
      avatar: "",
      roles: []
    };
    localStorage.removeItem("token");
    localStorage.removeItem("user-info");

    // 跳转到登录页
    window.location.href = "/login";
  };

  // 设置用户信息
  const setUserInfo = (info: typeof userInfo.value) => {
    userInfo.value = info;
    localStorage.setItem("user-info", JSON.stringify(info));
  };

  // 初始化用户信息
  const initUserInfo = () => {
    const stored = localStorage.getItem("user-info");
    if (stored) {
      try {
        userInfo.value = JSON.parse(stored);
      } catch (error) {
        console.warn("Failed to parse user info from localStorage:", error);
      }
    }
  };

  // 计算属性
  const device = computed(() => appState.device);
  const sidebar = computed(() => appState.sidebar);
  const isMobile = computed(() => appState.device === "mobile");
  const sidebarOpened = computed(() => appState.sidebar.opened);

  // 用户头像处理
  const userAvatar = computed(() => {
    return userInfo.value.avatar || "/default-avatar.png";
  });

  // 初始化
  const init = () => {
    checkDevice();
    initUserInfo();

    // 监听窗口大小变化
    window.addEventListener("resize", checkDevice);
  };

  return {
    device,
    sidebar,
    isMobile,
    sidebarOpened,
    isFullscreen,
    userInfo: computed(() => userInfo.value),
    userAvatar,

    toggleSideBar,
    closeSideBar,
    openSideBar,
    toggleFullScreen,
    logout,
    setUserInfo,
    checkDevice,
    init
  };
}
