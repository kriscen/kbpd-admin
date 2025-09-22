<template>
  <div
    class="sidebar-logo"
    :class="{ 'sidebar-logo-collapsed': !sidebarOpened }"
  >
    <router-link to="/" class="logo-link">
      <div class="logo-icon">
        <el-icon size="32" color="var(--el-color-primary)">
          <HomeFilled />
        </el-icon>
      </div>
      <span v-show="sidebarOpened" class="logo-title">KBPD Admin</span>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { HomeFilled } from "@element-plus/icons-vue";
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

    .logo-icon {
      margin-right: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
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

      .logo-icon {
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
