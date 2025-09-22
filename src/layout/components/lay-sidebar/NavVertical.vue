<template>
  <div class="sidebar-container" :class="sidebarClasses">
    <!-- Logo 区域 -->
    <SidebarLogo v-if="showLogo" />

    <!-- 菜单区域 -->
    <el-scrollbar class="sidebar-scrollbar">
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

    <!-- 折叠按钮 -->
    <div class="sidebar-collapse">
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
import { ArrowLeft, ArrowRight } from "@element-plus/icons-vue";
import { useNav } from "@/layout/hooks/useNav";
import { useLayout } from "@/layout/hooks/useLayout";
import SidebarLogo from "@/layout/components/lay-sidebar/SidebarLogo.vue";
import SidebarItem from "@/layout/components/lay-sidebar/SidebarItem.vue";

// 组合式函数
const { sidebarOpened, toggleSideBar } = useNav();
const { layoutConfig } = useLayout();

// 模拟菜单数据
const menuRoutes = computed(() => [
  {
    path: "/home",
    name: "Home",
    meta: {
      title: "首页",
      icon: "HomeFilled"
    }
  }
]);

// 计算属性
const sidebarClasses = computed(() => [
  "sidebar-container",
  {
    "sidebar-collapsed": !sidebarOpened.value,
    "sidebar-opened": sidebarOpened.value
  }
]);

const activeMenu = computed(() => {
  // 简化处理，默认激活首页
  return "/home";
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
  }

  .sidebar-scrollbar {
    flex: 1;
    height: 0;

    :deep(.el-scrollbar__wrap) {
      overflow-x: hidden;
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

    .el-button {
      width: 36px;
      height: 36px;
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .sidebar-container {
    transition: transform 0.3s;

    &:not(.sidebar-opened) {
      transform: translateX(-100%);
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
