<template>
  <div class="sidebar-container" :class="sidebarClasses">
    <!-- Logo 区域 -->
    <SidebarLogo v-if="showLogo" />

    <!-- 菜单区域 -->
    <el-scrollbar
      class="sidebar-scrollbar"
      :class="{ 'no-scroll': !sidebarOpened && !isMobile }"
    >
      <el-menu
        :default-active="activeMenu"
        :collapse="!sidebarOpened"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
        :router="true"
        class="sidebar-menu"
      >
        <SidebarItem
          v-for="route in menuRoutes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>

    <!-- 折叠按钮（桌面端始终显示） -->
    <div v-if="!isMobile" class="sidebar-collapse">
      <el-button
        text
        circle
        :icon="sidebarOpened ? ArrowLeft : ArrowRight"
        @click="toggleSideBar"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeft, ArrowRight } from "@element-plus/icons-vue";
import { useNav } from "@/layout/hooks/useNav";
import { useLayout } from "@/layout/hooks/useLayout";
import SidebarLogo from "@/layout/components/lay-sidebar/SidebarLogo.vue";
import SidebarItem from "@/layout/components/lay-sidebar/SidebarItem.vue";
import { constantRoutes } from "@/router/routes";

// 组合式函数
const { sidebarOpened, toggleSideBar, isMobile } = useNav();
const { layoutConfig } = useLayout();
const router = useRouter();

// 菜单路由数据
const menuRoutes = computed(() => {
  // 从路由配置中获取布局路由的子路由
  const layoutRoute = constantRoutes.find(route => route.path === "/");
  const children = layoutRoute?.children || [];

  // 过滤隐藏的路由并转换为MenuItem格式
  return children
    .filter((route: any) => !route.meta?.hidden)
    .map((route: any) => ({
      path: route.path,
      name: route.name || route.path,
      meta: route.meta
    }));
});

// 计算属性
const sidebarClasses = computed(() => [
  "sidebar-container",
  {
    "sidebar-collapsed": !sidebarOpened.value,
    "sidebar-opened": sidebarOpened.value
  }
]);

const activeMenu = computed(() => {
  // 获取当前路由路径
  return router.currentRoute.value.path;
});

const showLogo = computed(() => {
  return !layoutConfig.value.hideLogo;
});
</script>

<style lang="scss" scoped>
.sidebar-container {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 210px;
  background: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color-light);
  z-index: 1001;
  transition: width 0.3s;
  display: flex;
  flex-direction: column;

  &.sidebar-collapsed {
    width: 64px;

    :deep(.el-menu--collapse) {
      .el-menu-item,
      .el-sub-menu__title {
        padding: 0 20px;
        text-align: center;
      }
    }

    // 折叠状态下确保菜单区域内容不超出
    .sidebar-scrollbar {
      :deep(.el-scrollbar__view) {
        min-height: auto;
      }
    }
  }

  .sidebar-scrollbar {
    flex: 1;
    height: 0;

    :deep(.el-scrollbar__wrap) {
      overflow-x: hidden;
    }

    // 桌面端折叠时隐藏滚动条
    &.no-scroll {
      :deep(.el-scrollbar__wrap) {
        overflow-y: hidden;
      }

      :deep(.el-scrollbar__bar) {
        display: none;
      }
    }
  }

  .sidebar-menu {
    border: none;
    background: transparent;

    :deep(.el-menu-item) {
      &.is-active {
        background-color: var(--el-color-primary-light-9);
        color: var(--el-color-primary);

        &::before {
          content: "";
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background-color: var(--el-color-primary);
        }
      }

      &:hover {
        background-color: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
      }
    }

    :deep(.el-sub-menu) {
      .el-sub-menu__title:hover {
        background-color: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
      }
    }
  }

  .sidebar-collapse {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid var(--el-border-color-light);
    background: var(--el-bg-color);

    .el-button {
      width: 36px;
      height: 36px;

      &:hover {
        background-color: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
      }
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .sidebar-container {
    transform: translateX(-100%);
    transition: transform 0.3s;

    &.sidebar-opened {
      transform: translateX(0);
    }

    // 移动端必须保持滚动功能
    .sidebar-scrollbar.no-scroll {
      :deep(.el-scrollbar__wrap) {
        overflow-y: auto !important;
      }

      :deep(.el-scrollbar__bar) {
        display: block !important;
      }
    }
  }
}

// 暗色主题
:deep(.dark) {
  .sidebar-container {
    background: var(--el-bg-color-page);
    border-right-color: var(--el-border-color);
  }
}
</style>
