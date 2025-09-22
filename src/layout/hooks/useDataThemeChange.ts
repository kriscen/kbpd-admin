import { ref, computed } from "vue";
import type { ThemeType, OverallStyleType } from "../types";

// 主题相关状态
const currentTheme = ref<ThemeType>("light");
const isDarkMode = ref(false);
const overallStyle = ref<OverallStyleType>("light");

// 预设主题色
const themeColors = [
  { color: "#1677FF", themeColor: "blue" },
  { color: "#722ED1", themeColor: "purple" },
  { color: "#13C2C2", themeColor: "cyan" },
  { color: "#52C41A", themeColor: "green" },
  { color: "#FA8C16", themeColor: "orange" },
  { color: "#F5222D", themeColor: "red" },
  { color: "#EB2F96", themeColor: "magenta" },
  { color: "#FAAD14", themeColor: "gold" }
];

// 当前主题色
const currentThemeColor = ref("#1677FF");

export function useDataThemeChange() {
  // 应用主题到 DOM
  const applyTheme = (theme: ThemeType) => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    currentTheme.value = theme;
    isDarkMode.value = theme === "dark";
  };

  // 应用主题色
  const applyThemeColor = (color: string) => {
    document.documentElement.style.setProperty("--el-color-primary", color);

    // 生成主题色的各种变体
    const rgb = hexToRgb(color);
    if (rgb) {
      // 主色调的不同透明度
      for (let i = 1; i <= 9; i++) {
        const alpha = i / 10;
        document.documentElement.style.setProperty(
          `--el-color-primary-light-${i}`,
          `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
        );
      }

      // 主色调的深色变体
      const darkerColor = darkenColor(color, 0.2);
      document.documentElement.style.setProperty(
        "--el-color-primary-dark-2",
        darkerColor
      );
    }

    currentThemeColor.value = color;
  };

  // 系统主题检测
  const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");

  const updateSystemTheme = () => {
    if (overallStyle.value === "system") {
      const prefersDark = mediaQueryList.matches;
      applyTheme(prefersDark ? "dark" : "light");
    }
  };

  // 监听系统主题变化
  mediaQueryList.addEventListener("change", updateSystemTheme);

  // 设置整体风格
  const setOverallStyle = (style: OverallStyleType) => {
    overallStyle.value = style;

    switch (style) {
      case "light":
        applyTheme("light");
        break;
      case "dark":
        applyTheme("dark");
        break;
      case "system":
        updateSystemTheme();
        break;
    }

    // 保存到本地存储
    localStorage.setItem("overall-style", style);
  };

  // 切换主题
  const toggleTheme = () => {
    const newTheme = currentTheme.value === "light" ? "dark" : "light";
    applyTheme(newTheme);
    overallStyle.value = newTheme;
    localStorage.setItem("overall-style", newTheme);
  };

  // 设置主题色
  const setThemeColor = (color: string) => {
    applyThemeColor(color);
    localStorage.setItem("theme-color", color);
  };

  // 初始化主题
  const initTheme = () => {
    // 读取保存的整体风格
    const savedStyle = localStorage.getItem(
      "overall-style"
    ) as OverallStyleType;
    if (savedStyle) {
      setOverallStyle(savedStyle);
    } else {
      setOverallStyle("light");
    }

    // 读取保存的主题色
    const savedColor = localStorage.getItem("theme-color");
    if (savedColor) {
      applyThemeColor(savedColor);
    } else {
      applyThemeColor("#1677FF");
    }
  };

  // 灰色模式
  const grayMode = ref(false);
  const toggleGrayMode = (enabled: boolean) => {
    grayMode.value = enabled;
    document.documentElement.classList.toggle("gray-mode", enabled);
    localStorage.setItem("gray-mode", enabled.toString());
  };

  // 色弱模式
  const weakMode = ref(false);
  const toggleWeakMode = (enabled: boolean) => {
    weakMode.value = enabled;
    document.documentElement.classList.toggle("weak-mode", enabled);
    localStorage.setItem("weak-mode", enabled.toString());
  };

  // 初始化其他模式
  const initModes = () => {
    const savedGrayMode = localStorage.getItem("gray-mode") === "true";
    const savedWeakMode = localStorage.getItem("weak-mode") === "true";

    toggleGrayMode(savedGrayMode);
    toggleWeakMode(savedWeakMode);
  };

  // 工具函数：16进制转RGB
  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  }

  // 工具函数：颜色加深
  function darkenColor(color: string, amount: number) {
    const rgb = hexToRgb(color);
    if (!rgb) return color;

    const darken = (val: number) => Math.max(0, Math.floor(val * (1 - amount)));

    return `rgb(${darken(rgb.r)}, ${darken(rgb.g)}, ${darken(rgb.b)})`;
  }

  // 计算属性
  const isDark = computed(() => isDarkMode.value);
  const theme = computed(() => currentTheme.value);
  const themeColor = computed(() => currentThemeColor.value);

  // 初始化
  const init = () => {
    initTheme();
    initModes();
  };

  return {
    theme,
    isDark,
    themeColor,
    overallStyle: computed(() => overallStyle.value),
    themeColors,
    grayMode: computed(() => grayMode.value),
    weakMode: computed(() => weakMode.value),

    setOverallStyle,
    toggleTheme,
    setThemeColor,
    toggleGrayMode,
    toggleWeakMode,
    init
  };
}
