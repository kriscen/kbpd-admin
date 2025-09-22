<template>
  <div
    class="sidebar-logo"
    :class="{ 'sidebar-logo-collapsed': !sidebarOpened }"
  >
    <router-link to="/" class="logo-link">
      <img src="/logo.svg" alt="Logo" class="logo-image" />
      <span v-show="sidebarOpened" class="logo-title">KBPD Admin</span>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { useNav } from "@/layout/hooks/useNav";

const { sidebarOpened } = useNav();
</script>

<style lang="scss" scoped>
.sidebar-logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--el-border-color-light);
  overflow: hidden;

  .logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: var(--el-text-color-primary);
    transition: all 0.3s;
    padding: 0 16px;

    .logo-image {
      width: 32px;
      height: 32px;
      margin-right: 12px;
    }

    .logo-title {
      font-size: 18px;
      font-weight: 600;
      white-space: nowrap;
      transition: opacity 0.3s;
    }

    &:hover {
      color: var(--el-color-primary);
    }
  }

  &.sidebar-logo-collapsed {
    .logo-link {
      justify-content: center;

      .logo-image {
        margin-right: 0;
      }
    }
  }
}

// 暗色主题
:deep(.dark) {
  .sidebar-logo {
    border-bottom-color: var(--el-border-color);
  }
}
</style>
