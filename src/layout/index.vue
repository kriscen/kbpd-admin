<template>
  <div ref="appWrapperRef" :class="layoutClasses">
    <!-- 移动端遮罩层 -->
    <div
      v-show="isMobile && sidebarOpened"
      class="app-mask"
      @click="toggleSideBar"
    />

    <!-- 侧边栏导航 -->
    <NavVertical v-show="showSidebar" />

    <!-- 主容器 -->
    <div class="main-container" :class="mainContainerClasses">
      <!-- 顶部区域 -->
      <div v-if="showHeader" class="layout-header">
        <!-- 导航栏 -->
        <LayNavbar />
        <!-- 标签页 -->
        <LayTag v-if="!layoutConfig.hideTabs" />
      </div>

      <!-- 内容区域 -->
      <LayContent :style="{ 'padding-top': contentPaddingTop }" />

      <!-- 页脚 -->
      <LayFooter v-if="!layoutConfig.hideFooter" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useLayout } from "@/layout/hooks/useLayout";
import { useNav } from "@/layout/hooks/useNav";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";

// 导入组件
import NavVertical from "@/layout/components/lay-sidebar/NavVertical.vue";
import LayNavbar from "@/layout/components/lay-navbar/index.vue";
import LayTag from "@/layout/components/lay-tag/index.vue";
import LayContent from "@/layout/components/lay-content/index.vue";
import LayFooter from "@/layout/components/lay-footer/index.vue";

// 组合式函数
const { layoutConfig, initStorage } = useLayout();
const {
  sidebar,
  isMobile,
  sidebarOpened,
  toggleSideBar,
  init: initNav
} = useNav();
const { init: initTheme } = useDataThemeChange();

// DOM 引用
const appWrapperRef = ref<HTMLElement>();

// 计算属性
const layoutClasses = computed(() => [
  "app-wrapper",
  layoutConfig.value.layout,
  {
    mobile: isMobile.value,
    "sidebar-opened": sidebarOpened.value,
    "sidebar-closed": !sidebarOpened.value,
    "without-animation": sidebar.value.withoutAnimation,
    "dark-mode": layoutConfig.value.darkMode,
    stretch: layoutConfig.value.stretch
  }
]);

const mainContainerClasses = computed(() => [
  "main-container",
  {
    "fixed-header": true, // 固定头部
    "no-tags": layoutConfig.value.hideTabs
  }
]);

// 是否显示侧边栏
const showSidebar = computed(() => {
  return (
    layoutConfig.value.layout === "vertical" ||
    (layoutConfig.value.layout === "mix" && !isMobile.value)
  );
});

// 是否显示头部
const showHeader = computed(() => {
  return (
    layoutConfig.value.layout !== "vertical" ||
    layoutConfig.value.layout === "vertical"
  );
});

// 计算内容区域的顶部边距
const contentPaddingTop = computed(() => {
  if (!showHeader.value) return "0";

  // 导航栏高度 + 标签栏高度
  const navbarHeight = 50;
  const tagHeight = layoutConfig.value.hideTabs ? 0 : 40;
  return `${navbarHeight + tagHeight}px`;
});

// 窗口大小变化处理
const handleResize = () => {
  const rect = document.body.getBoundingClientRect();
  const isMobileDevice = rect.width < 768;

  if (isMobileDevice !== isMobile.value) {
    // 设备类型发生变化时的处理
    if (isMobileDevice && sidebarOpened.value) {
      // 移动端默认关闭侧边栏
      toggleSideBar();
    }
  }
};

// 生命周期
onMounted(() => {
  // 初始化各种配置
  initStorage();
  initNav();
  initTheme();

  // 添加窗口大小变化监听
  window.addEventListener("resize", handleResize);

  // 初始检查设备类型
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;

  &.mobile {
    .main-container {
      margin-left: 0;
    }
  }

  &.sidebar-opened {
    &:not(.mobile) {
      .main-container {
        margin-left: 210px;
        transition: margin-left 0.3s;
      }
    }

    &.mobile {
      .main-container {
        margin-left: 0;
      }
    }
  }

  &.sidebar-closed {
    .main-container {
      margin-left: 64px;
      transition: margin-left 0.3s;
    }

    &.mobile {
      .main-container {
        margin-left: 0;
      }
    }
  }

  &.without-animation {
    .main-container {
      transition: none;
    }

    // 禁止头部动画
    &.fixed-header {
      .layout-header {
        transition: none;
      }
    }
  }

  &.vertical {
    .main-container {
      min-height: 100vh;
    }
  }

  &.horizontal {
    display: flex;
    flex-direction: column;

    .main-container {
      margin-left: 0;
      flex: 1;
    }

    // 水平布局下头部不需要调整left
    &.fixed-header {
      .layout-header {
        left: 0;
      }
    }
  }

  &.mix {
    .main-container {
      margin-left: 0;

      &.has-sidebar {
        margin-left: 210px;
      }
    }

    // 混合布局下的头部定位调整
    &.fixed-header {
      .layout-header {
        left: 0;
      }

      &.has-sidebar {
        .layout-header {
          left: 210px;
        }
      }
    }
  }

  &.stretch {
    .main-container {
      margin-left: 0;
    }

    // 拉伸模式下头部占满宽度
    &.fixed-header {
      .layout-header {
        left: 0;
      }
    }
  }

  // 固定头部的通用样式
  .main-container.fixed-header {
    .layout-header {
      position: fixed;
      top: 0;
      right: 0;
      z-index: 100;
      background: var(--el-bg-color);
      border-bottom: 1px solid var(--el-border-color-light);
      // 默认侧边栏展开状态
      left: 210px;
      transition: left 0.3s;
    }
  }

  // 侧边栏收缩时调整头部位置
  &.sidebar-closed .main-container.fixed-header {
    .layout-header {
      left: 64px;
    }
  }

  // 移动端时头部占满宽度
  &.mobile .main-container.fixed-header {
    .layout-header {
      left: 0 !important;
    }
  }

  // 水平布局下头部不需要调整left
  &.horizontal .main-container.fixed-header {
    .layout-header {
      left: 0 !important;
    }
  }

  // 拉伸模式下头部占满宽度
  &.stretch .main-container.fixed-header {
    .layout-header {
      left: 0 !important;
    }
  }

  // 禁止头部动画
  &.without-animation .main-container.fixed-header {
    .layout-header {
      transition: none;
    }
  }
}

.app-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999;
}

.main-container {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  .layout-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--el-bg-color);
    border-bottom: 1px solid var(--el-border-color-light);
  }

  &.no-tags {
    .layout-header {
      :deep(.lay-tag) {
        display: none;
      }
    }
  }
}

// 暗色主题
.dark-mode {
  .main-container {
    .layout-header {
      background: var(--el-bg-color-page);
      border-bottom-color: var(--el-border-color);
    }
  }
}

// 响应式布局
@media (max-width: 768px) {
  .app-wrapper {
    &.sidebar-opened {
      .main-container {
        margin-left: 0;
      }
    }
  }
}
</style>
