<template>
  <div class="navbar-container">
    <div class="navbar-left">
      <!-- 移动端菜单切换按钮 -->
      <div v-if="isMobile" class="hamburger-menu" @click="toggleSideBar">
        <el-icon size="20">
          <Menu />
        </el-icon>
      </div>

      <!-- 面包屑导航 -->
      <el-breadcrumb
        v-if="!isMobile && layout !== 'mix'"
        separator="/"
        class="breadcrumb"
      >
        <el-breadcrumb-item
          v-for="item in breadcrumbs"
          :key="item.path"
          :to="item.path === route.path ? undefined : item.path"
        >
          {{ item.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="navbar-right">
      <!-- 全局搜索 -->
      <div class="navbar-item search-item">
        <el-tooltip content="搜索菜单" placement="bottom">
          <el-icon size="18" @click="showSearch">
            <Search />
          </el-icon>
        </el-tooltip>
      </div>

      <!-- 全屏切换 -->
      <div class="navbar-item">
        <el-tooltip
          :content="isFullscreen ? '退出全屏' : '全屏'"
          placement="bottom"
        >
          <el-icon size="18" @click="toggleFullScreen">
            <FullScreen v-if="!isFullscreen" />
            <Aim v-else />
          </el-icon>
        </el-tooltip>
      </div>

      <!-- 消息通知 -->
      <div class="navbar-item">
        <el-badge :value="notificationCount" :hidden="notificationCount === 0">
          <el-tooltip content="消息通知" placement="bottom">
            <el-icon size="18" @click="showNotifications">
              <Bell />
            </el-icon>
          </el-tooltip>
        </el-badge>
      </div>

      <!-- 用户菜单 -->
      <el-dropdown class="user-dropdown" @command="handleUserCommand">
        <div class="user-info">
          <el-avatar :size="32" :src="userAvatar">
            <el-icon><User /></el-icon>
          </el-avatar>
          <span v-if="!isMobile" class="username">{{ userInfo.username }}</span>
          <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              个人中心
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon>
              系统设置
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 搜索弹窗 -->
    <LaySearch v-model="searchVisible" />

    <!-- 通知弹窗 -->
    <LayNotice v-model="noticeVisible" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  Menu,
  Search,
  FullScreen,
  Aim,
  Bell,
  User,
  ArrowDown,
  Setting,
  SwitchButton
} from "@element-plus/icons-vue";
import { useNav } from "@/layout/hooks/useNav";
import { useLayout } from "@/layout/hooks/useLayout";
import LaySearch from "@/layout/components/lay-search/index.vue";
import LayNotice from "@/layout/components/lay-notice/index.vue";

// 组合式函数
const {
  isMobile,
  sidebarOpened,
  toggleSideBar,
  isFullscreen,
  toggleFullScreen,
  userInfo,
  userAvatar,
  logout
} = useNav();
const { layout } = useLayout();

const route = useRoute();
const router = useRouter();

// 弹窗状态
const searchVisible = ref(false);
const noticeVisible = ref(false);

// 通知数量
const notificationCount = ref(3);

// 面包屑导航
const breadcrumbs = computed(() => {
  const matched = route.matched.filter(item => item.meta?.title);
  return matched.map(item => ({
    path: item.path,
    title: item.meta?.title as string
  }));
});

// 方法
const showSearch = () => {
  searchVisible.value = true;
};

const showNotifications = () => {
  noticeVisible.value = true;
};

const showSettings = () => {
  // 触发设置面板显示事件
  window.dispatchEvent(new CustomEvent("show-settings"));
};

const handleUserCommand = (command: string) => {
  switch (command) {
    case "profile":
      router.push("/profile");
      break;
    case "settings":
      router.push("/settings");
      break;
    case "logout":
      logout();
      break;
    default:
      break;
  }
};
</script>

<style lang="scss" scoped>
.navbar-container {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);

  .navbar-left {
    display: flex;
    align-items: center;
    flex: 1;

    .hamburger-menu {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.3s;
      margin-right: 12px;

      &:hover {
        background-color: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
      }
    }

    .breadcrumb {
      :deep(.el-breadcrumb__item) {
        .el-breadcrumb__inner {
          color: var(--el-text-color-regular);
          font-weight: normal;

          &:hover {
            color: var(--el-color-primary);
          }
        }

        &:last-child {
          .el-breadcrumb__inner {
            color: var(--el-text-color-primary);
            font-weight: 500;
          }
        }
      }
    }
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 12px;

    .navbar-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.3s;
      color: var(--el-text-color-regular);

      &:hover {
        background-color: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
      }

      &.search-item {
        .el-icon {
          transition: transform 0.3s;
        }

        &:hover .el-icon {
          transform: scale(1.1);
        }
      }
    }

    .user-dropdown {
      :deep(.el-dropdown) {
        height: 36px;
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 8px;
      height: 36px;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.3s;

      &:hover {
        background-color: var(--el-color-primary-light-9);
      }

      .username {
        font-size: 14px;
        color: var(--el-text-color-primary);
        font-weight: 500;
      }

      .dropdown-icon {
        font-size: 12px;
        color: var(--el-text-color-secondary);
        transition: transform 0.3s;
      }

      &:hover .dropdown-icon {
        transform: rotate(180deg);
      }
    }
  }
}

// 暗色主题
:deep(.dark) {
  .navbar-container {
    background: var(--el-bg-color-page);
    border-bottom-color: var(--el-border-color);
  }
}

// 移动端适配
@media (max-width: 768px) {
  .navbar-container {
    padding: 0 12px;

    .navbar-right {
      gap: 8px;

      .navbar-item {
        width: 32px;
        height: 32px;
      }

      .user-info {
        padding: 0 4px;

        .username {
          display: none;
        }
      }
    }
  }
}
</style>
