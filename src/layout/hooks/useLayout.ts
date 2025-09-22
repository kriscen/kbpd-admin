import { ref, computed } from "vue";
import { getAppConfig } from "@/config";
import type {
  LayoutConfig,
  LayoutType,
  ThemeType,
  OverallStyleType
} from "../types";

// 从配置文件获取默认配置
const appConfig = getAppConfig();

// 默认布局配置 - 从配置文件映射到原有格式
const defaultConfig: LayoutConfig = {
  layout: appConfig.layout.mode as LayoutType,
  theme: appConfig.layout.theme.style as ThemeType,
  darkMode: appConfig.layout.theme.style === "dark",
  sidebarStatus: !appConfig.layout.sidebar.collapsed,
  epThemeColor: appConfig.layout.theme.primaryColor,
  themeColor: "default",
  overallStyle: appConfig.layout.theme.style as OverallStyleType,
  isKeepAlive: appConfig.layout.features.keepAlive,
  hideTabs: !appConfig.layout.features.showTabs,
  hideFooter: !appConfig.layout.features.showFooter,
  stretch: appConfig.layout.features.stretch,
  multiTagsCache: appConfig.layout.features.multiTagsCache,
  weakMode: appConfig.layout.theme.weakMode,
  greyMode: appConfig.layout.theme.grayMode
};

// 布局配置状态
const layoutConfig = ref<LayoutConfig>({ ...defaultConfig });

export function useLayout() {
  // 初始化配置
  const initStorage = () => {
    const stored = localStorage.getItem("layout-config");
    if (stored) {
      try {
        const config = JSON.parse(stored);
        layoutConfig.value = { ...defaultConfig, ...config };
      } catch (error) {
        console.warn("Failed to parse layout config from localStorage:", error);
        layoutConfig.value = { ...defaultConfig };
      }
    } else {
      layoutConfig.value = { ...defaultConfig };
    }
  };

  // 保存配置到本地存储
  const saveConfig = () => {
    localStorage.setItem("layout-config", JSON.stringify(layoutConfig.value));
  };

  // 更新布局模式
  const setLayout = (layout: LayoutType) => {
    layoutConfig.value.layout = layout;
    saveConfig();
  };

  // 更新主题
  const setTheme = (theme: ThemeType) => {
    layoutConfig.value.theme = theme;
    layoutConfig.value.darkMode = theme === "dark";
    saveConfig();
  };

  // 更新整体风格
  const setOverallStyle = (style: OverallStyleType) => {
    layoutConfig.value.overallStyle = style;

    if (style === "system") {
      // 跟随系统主题
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      layoutConfig.value.darkMode = mediaQuery.matches;
      layoutConfig.value.theme = mediaQuery.matches ? "dark" : "light";
    } else {
      layoutConfig.value.darkMode = style === "dark";
      layoutConfig.value.theme = style;
    }
    saveConfig();
  };

  // 切换侧边栏状态
  const toggleSidebar = () => {
    layoutConfig.value.sidebarStatus = !layoutConfig.value.sidebarStatus;
    saveConfig();
  };

  // 更新主题色
  const setThemeColor = (color: string) => {
    layoutConfig.value.epThemeColor = color;
    saveConfig();
  };

  // 更新配置项
  const updateConfig = (key: keyof LayoutConfig, value: any) => {
    (layoutConfig.value as any)[key] = value;
    saveConfig();
  };

  // 重置配置
  const resetConfig = () => {
    layoutConfig.value = { ...defaultConfig };
    saveConfig();
  };

  // 计算属性
  const isDark = computed(() => layoutConfig.value.darkMode);
  const layout = computed(() => layoutConfig.value.layout);
  const sidebarOpened = computed(() => layoutConfig.value.sidebarStatus);

  return {
    layoutConfig: computed(() => layoutConfig.value),
    isDark,
    layout,
    sidebarOpened,
    initStorage,
    setLayout,
    setTheme,
    setOverallStyle,
    toggleSidebar,
    setThemeColor,
    updateConfig,
    resetConfig
  };
}
