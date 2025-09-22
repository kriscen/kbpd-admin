/**
 * Layout 布局类型定义
 */

export type LayoutType = "vertical" | "horizontal" | "mix";
export type ThemeType = "light" | "dark";
export type OverallStyleType = "light" | "dark" | "system";
export type DeviceType = "mobile" | "desktop";

export interface LayoutConfig {
  layout: LayoutType;
  theme: ThemeType;
  darkMode: boolean;
  sidebarStatus: boolean;
  epThemeColor: string;
  themeColor: string;
  overallStyle: OverallStyleType;
  isKeepAlive: boolean;
  hideTabs: boolean;
  hideFooter: boolean;
  hideLogo?: boolean;
  stretch: boolean;
  multiTagsCache: boolean;
  weakMode: boolean;
  greyMode: boolean;
}

export interface TagView {
  path: string;
  name?: string;
  title: string;
  icon?: string;
  close?: boolean;
  affix?: boolean;
  keepAlive?: boolean;
}

export interface MenuRoute {
  path: string;
  name: string;
  meta: {
    title: string;
    icon?: string;
    hidden?: boolean;
    keepAlive?: boolean;
    affix?: boolean;
    roles?: string[];
    activeMenu?: string;
  };
  children?: MenuRoute[];
}

export interface SidebarState {
  opened: boolean;
  withoutAnimation: boolean;
}

export interface AppState {
  device: DeviceType;
  sidebar: SidebarState;
}

export interface TagsViewContextMenu {
  visible: boolean;
  top: number;
  left: number;
  selectedTag?: TagView;
}

// 设置面板配置项
export interface SettingPanelConfig {
  title: string;
  layout: boolean;
  theme: boolean;
  darkMode: boolean;
  sidebarLogo: boolean;
  tagsView: boolean;
  fixedHeader: boolean;
  sidebarTextTheme: boolean;
  showFooter: boolean;
  grayMode: boolean;
  weakMode: boolean;
  hideTabs: boolean;
  stretch: boolean;
  showLogo: boolean;
  multiTagsCache: boolean;
}

// 主题色配置
export interface ThemeColor {
  color: string;
  themeColor: string;
}

// 过渡动画配置
export interface TransitionConfig {
  name: string;
  enterTransition?: string;
  leaveTransition?: string;
}

// 导航菜单项类型
export interface MenuItem {
  path: string;
  name: string;
  title?: string;
  icon?: string;
  children?: MenuItem[];
  meta?: {
    title?: string;
    icon?: string;
    hidden?: boolean;
    keepAlive?: boolean;
    affix?: boolean;
    roles?: string[];
    activeMenu?: string;
  };
}
