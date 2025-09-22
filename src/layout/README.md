# Layout 布局系统

基于 Vue 3 + TypeScript + Element Plus 的现代化后台管理系统布局解决方案。

## 特性

- 🎨 **多布局模式**: 支持垂直、水平、混合三种布局模式
- 📱 **响应式设计**: 完美适配桌面端和移动端
- 🎪 **主题系统**: 支持明暗主题切换和自定义主题色
- 🔧 **高度可配置**: 丰富的配置选项和实时预览
- 🚀 **性能优化**: 路由级别的组件缓存和懒加载
- 🎯 **用户体验**: 流畅的动画过渡和交互反馈

## 目录结构

```
src/layout/
├── components/              # 布局组件集合
│   ├── lay-content/        # 主体内容区
│   ├── lay-footer/         # 页脚组件
│   ├── lay-frame/          # 框架组件
│   ├── lay-navbar/         # 顶部导航栏
│   ├── lay-notice/         # 消息通知
│   ├── lay-search/         # 全局搜索
│   ├── lay-setting/        # 系统设置
│   ├── lay-sidebar/        # 侧边栏导航
│   └── lay-tag/           # 标签页管理
├── hooks/                  # 组合式函数
│   ├── useBoolean.ts      # 布尔状态管理
│   ├── useDataThemeChange.ts # 主题切换
│   ├── useLayout.ts       # 布局配置
│   ├── useNav.ts          # 导航逻辑
│   └── useTag.ts          # 标签页逻辑
├── styles/                 # 样式文件
│   └── index.scss         # 主样式文件
├── index.vue              # 主布局组件
├── frame.vue              # 框架页面
├── redirect.vue           # 重定向组件
└── types.ts              # 类型定义
```

## 快速开始

### 1. 基本使用

```vue
<template>
  <Layout />
</template>

<script setup lang="ts">
import Layout from "@/layout/index.vue";
</script>
```

### 2. 使用布局 Hooks

```vue
<script setup lang="ts">
import { useLayout, useNav, useTag } from "@/layout/hooks";

// 布局配置
const { layoutConfig, setLayout, toggleSidebar } = useLayout();

// 导航控制
const { userInfo, logout, toggleFullScreen } = useNav();

// 标签页管理
const { tagsList, addTag, removeTag } = useTag();
</script>
```

### 3. 自定义主题

```vue
<script setup lang="ts">
import { useDataThemeChange } from "@/layout/hooks";

const { setThemeColor, setOverallStyle, toggleGrayMode } = useDataThemeChange();

// 设置主题色
setThemeColor("#1677FF");

// 设置整体风格
setOverallStyle("dark");

// 开启灰色模式
toggleGrayMode(true);
</script>
```

## 配置选项

### 布局配置

```typescript
interface LayoutConfig {
  layout: "vertical" | "horizontal" | "mix"; // 布局模式
  theme: "light" | "dark"; // 主题模式
  darkMode: boolean; // 暗色模式
  sidebarStatus: boolean; // 侧边栏状态
  epThemeColor: string; // Element Plus 主题色
  themeColor: string; // 主题色名称
  overallStyle: "light" | "dark" | "system"; // 整体风格
  isKeepAlive: boolean; // 页面缓存
  hideTabs: boolean; // 隐藏标签页
  hideFooter: boolean; // 隐藏页脚
  stretch: boolean; // 内容区拉伸
  multiTagsCache: boolean; // 标签页持久化
  weakMode: boolean; // 色弱模式
  greyMode: boolean; // 灰色模式
}
```

### 菜单配置

```typescript
interface MenuItem {
  path: string; // 路由路径
  name: string; // 路由名称
  title?: string; // 显示标题
  icon?: string; // 图标名称
  children?: MenuItem[]; // 子菜单
  meta?: {
    title?: string; // 页面标题
    icon?: string; // 菜单图标
    hidden?: boolean; // 是否隐藏
    keepAlive?: boolean; // 是否缓存
    affix?: boolean; // 是否固定标签
    roles?: string[]; // 权限角色
    activeMenu?: string; // 激活菜单
  };
}
```

## 布局模式

### 垂直布局 (Vertical)

侧边栏位于左侧，适合传统后台管理系统。

```typescript
setLayout("vertical");
```

### 水平布局 (Horizontal)

顶部包含导航菜单，适合菜单层级较少的系统。

```typescript
setLayout("horizontal");
```

### 混合布局 (Mix)

结合垂直和水平布局的优点，适合菜单层级复杂的大型系统。

```typescript
setLayout("mix");
```

## 响应式断点

| 设备类型 | 屏幕宽度       | 布局特点                 |
| -------- | -------------- | ------------------------ |
| 移动端   | < 768px        | 隐藏侧边栏，显示汉堡菜单 |
| 平板端   | 768px - 1024px | 自适应侧边栏宽度         |
| 桌面端   | > 1024px       | 完整布局展示             |

## 主题定制

### CSS 变量

```scss
:root {
  /* 布局尺寸 */
  --layout-sidebar-width: 210px;
  --layout-sidebar-collapsed-width: 64px;
  --layout-header-height: 50px;
  --layout-tags-height: 40px;
  --layout-footer-height: 50px;

  /* 过渡动画 */
  --layout-transition-duration: 0.3s;
  --layout-transition-function: ease;
}
```

### 主题色配置

```typescript
const themeColors = [
  { color: "#1677FF", themeColor: "blue" },
  { color: "#722ED1", themeColor: "purple" },
  { color: "#13C2C2", themeColor: "cyan" },
  { color: "#52C41A", themeColor: "green" },
  { color: "#FA8C16", themeColor: "orange" },
  { color: "#F5222D", themeColor: "red" }
];
```

## 组件 API

### useLayout

```typescript
const {
  layoutConfig, // 当前布局配置
  isDark, // 是否暗色模式
  layout, // 当前布局模式
  sidebarOpened, // 侧边栏是否打开
  setLayout, // 设置布局模式
  setTheme, // 设置主题
  toggleSidebar, // 切换侧边栏
  updateConfig, // 更新配置
  resetConfig // 重置配置
} = useLayout();
```

### useNav

```typescript
const {
  device, // 设备类型
  sidebar, // 侧边栏状态
  isMobile, // 是否移动端
  isFullscreen, // 是否全屏
  userInfo, // 用户信息
  userAvatar, // 用户头像
  toggleSideBar, // 切换侧边栏
  toggleFullScreen, // 切换全屏
  logout // 退出登录
} = useNav();
```

### useTag

```typescript
const {
  tagsList, // 标签页列表
  activeTagPath, // 当前激活标签
  addTag, // 添加标签
  removeTag, // 删除标签
  removeOtherTags, // 删除其他标签
  removeAllTags, // 删除所有标签
  refreshCurrentPage // 刷新当前页
} = useTag();
```

## 最佳实践

1. **性能优化**: 使用路由懒加载和组件缓存
2. **响应式设计**: 合理使用断点和媒体查询
3. **无障碍访问**: 提供键盘导航和屏幕阅读器支持
4. **SEO 友好**: 设置合适的页面标题和 meta 信息

## 兼容性

- Vue 3.5+
- TypeScript 5.0+
- Element Plus 2.9+
- 现代浏览器 (Chrome 88+, Firefox 85+, Safari 14+)

## 许可证

MIT License
