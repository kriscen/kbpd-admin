# 布局配置使用指南

## 概述

设置面板UI已被移除，所有布局配置现在通过配置文件进行管理。这种方式提供了更好的可维护性和统一的配置管理。

## 配置文件位置

主配置文件：`src/config/index.ts`

## 配置项说明

### 布局模式 (layout.mode)

- `vertical`: 垂直布局，侧边栏在左侧
- `horizontal`: 水平布局，导航在顶部
- `mix`: 混合布局，结合垂直和水平布局

### 主题配置 (layout.theme)

- `style`: 主题模式
  - `light`: 明亮主题
  - `dark`: 暗黑主题
  - `system`: 跟随系统主题
- `primaryColor`: 主题色，默认为 `#409eff`
- `grayMode`: 是否启用灰色模式
- `weakMode`: 是否启用色弱模式

### 功能配置 (layout.features)

- `fixedHeader`: 是否固定头部
- `showTabs`: 是否显示标签页
- `showFooter`: 是否显示页脚
- `keepAlive`: 是否启用页面缓存
- `multiTagsCache`: 是否启用标签页持久化
- `stretch`: 是否启用内容区拉伸

### 侧边栏配置 (layout.sidebar)

- `collapsed`: 是否折叠侧边栏
- `width`: 侧边栏展开宽度，默认 210px
- `collapsedWidth`: 侧边栏折叠宽度，默认 64px

### 布局尺寸 (layout)

- `headerHeight`: 头部高度，默认 60px
- `footerHeight`: 页脚高度，默认 40px

## 配置示例

```typescript
// src/config/index.ts
layout: {
  mode: "vertical",  // 布局模式

  theme: {
    style: "light",        // 主题风格
    primaryColor: "#409eff", // 主题色
    grayMode: false,       // 灰色模式
    weakMode: false        // 色弱模式
  },

  features: {
    fixedHeader: true,      // 固定头部
    showTabs: true,         // 显示标签页
    showFooter: true,       // 显示页脚
    keepAlive: true,        // 页面缓存
    multiTagsCache: false,  // 标签页持久化
    stretch: false          // 内容区拉伸
  },

  sidebar: {
    collapsed: false,       // 侧边栏是否折叠
    width: 210,            // 展开宽度
    collapsedWidth: 64     // 折叠宽度
  },

  headerHeight: 60,  // 头部高度
  footerHeight: 40   // 页脚高度
}
```

## 使用方式

1. **直接修改配置文件**

   ```typescript
   // 修改 src/config/index.ts 中的 layout 配置
   layout: {
     mode: "horizontal",  // 改为水平布局
     // ... 其他配置
   }
   ```

2. **配置生效时机**

   - 配置会在应用启动时自动加载
   - 修改配置后需要重启开发服务器

3. **用户个人设置**
   - 用户的个人设置仍会保存在本地存储中
   - 本地设置优先级高于配置文件
   - 可通过清除本地存储恢复到配置文件设置

## 迁移说明

- ✅ 设置面板UI已移除
- ✅ 所有配置功能已迁移到配置文件
- ✅ 保持了原有的功能完整性
- ✅ 支持用户个人设置的本地存储

## 注意事项

1. 修改配置文件后需要重启应用
2. 用户的本地设置会覆盖配置文件的默认值
3. 配置文件采用TypeScript类型约束，确保配置正确性
4. 遵循了Vue组合式API的最佳实践和项目规范

## 相关文件

- `src/config/index.ts` - 主配置文件
- `src/layout/hooks/useLayout.ts` - 布局配置钩子
- `src/layout/index.vue` - 主布局组件
- `src/layout/types.ts` - 类型定义
