<template>
  <div class="tags-container" :class="tagsClasses">
    <div class="tags-wrapper">
      <!-- 滚动容器 -->
      <el-scrollbar ref="scrollbarRef" class="tags-scrollbar">
        <div class="tags-content" @contextmenu.prevent>
          <transition-group name="tag" tag="div" class="tags-list">
            <div
              v-for="tag in tagsList"
              :key="tag.path"
              class="tag-item"
              :class="{
                'is-active': tag.path === activeTagPath,
                'is-affix': tag.affix
              }"
              @click="handleTagClick(tag)"
              @contextmenu.prevent="handleRightClick($event, tag)"
            >
              <span class="tag-title">{{ tag.title }}</span>
              <el-icon
                v-if="!tag.affix && tagsList.length > 1"
                class="tag-close"
                @click.stop="handleTagClose(tag)"
              >
                <Close />
              </el-icon>
            </div>
          </transition-group>
        </div>
      </el-scrollbar>

      <!-- 标签页操作按钮 -->
      <div class="tags-actions">
        <el-dropdown @command="handleCommand">
          <el-button size="small" text>
            <el-icon><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="refresh">
                <el-icon><RefreshRight /></el-icon>
                重新加载
              </el-dropdown-item>
              <el-dropdown-item divided command="close-others">
                <el-icon><CircleClose /></el-icon>
                关闭其他
              </el-dropdown-item>
              <el-dropdown-item command="close-left">
                <el-icon><Back /></el-icon>
                关闭左侧
              </el-dropdown-item>
              <el-dropdown-item command="close-right">
                <el-icon><Right /></el-icon>
                关闭右侧
              </el-dropdown-item>
              <el-dropdown-item command="close-all">
                <el-icon><FolderDelete /></el-icon>
                关闭全部
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 右键菜单 -->
    <div
      v-show="contextMenu.visible"
      ref="contextMenuRef"
      class="context-menu"
      :style="{
        left: contextMenu.left + 'px',
        top: contextMenu.top + 'px'
      }"
    >
      <div
        v-for="item in contextMenuItems"
        v-show="item.show"
        :key="item.label"
        class="context-menu-item"
        @click="item.action"
      >
        <el-icon><component :is="getIconComponent(item.icon)" /></el-icon>
        <span>{{ item.label }}</span>
      </div>
    </div>

    <!-- 遮罩层，用于隐藏右键菜单 -->
    <div
      v-show="contextMenu.visible"
      class="context-menu-overlay"
      @click="hideContextMenu"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  Close,
  ArrowDown,
  RefreshRight,
  CircleClose,
  Back,
  Right,
  FolderDelete
} from "@element-plus/icons-vue";
import { useTag } from "@/layout/hooks/useTag";
import { useLayout } from "@/layout/hooks/useLayout";

// 组合式函数
const {
  tagsList,
  activeTagPath,
  contextMenu,
  contextMenuItems,
  addTag,
  removeTag,
  removeOtherTags,
  removeLeftTags,
  removeRightTags,
  removeAllTags,
  refreshCurrentPage,
  showContextMenu,
  hideContextMenu,
  initTags,
  addCurrentRouteTag,
  cleanDuplicateTags
} = useTag();

const { layoutConfig } = useLayout();
const router = useRouter();
const route = useRoute();

// 引用
const scrollbarRef = ref();
const contextMenuRef = ref();

// 计算属性
const tagsClasses = computed(() => [
  "tags-container",
  {
    "tags-card": true, // 卡片模式
    "tags-smart": false, // 智能模式
    "dark-mode": layoutConfig.value.darkMode
  }
]);

// 图标组件映射
const iconComponents = {
  RefreshRight,
  Close,
  CircleClose,
  Back,
  Right,
  FolderDelete
};

const getIconComponent = (iconName: string) => {
  return iconComponents[iconName as keyof typeof iconComponents] || Close;
};

// 方法
const handleTagClick = (tag: any) => {
  if (tag.path !== route.path) {
    router.push(tag.path);
  }
};

const handleTagClose = (tag: any) => {
  removeTag(tag.path);
};

const handleRightClick = (event: MouseEvent, tag: any) => {
  showContextMenu(tag, event);
};

const handleCommand = (command: string) => {
  switch (command) {
    case "refresh":
      refreshCurrentPage();
      break;
    case "close-others":
      removeOtherTags(activeTagPath.value);
      break;
    case "close-left":
      removeLeftTags(activeTagPath.value);
      break;
    case "close-right":
      removeRightTags(activeTagPath.value);
      break;
    case "close-all":
      removeAllTags();
      break;
  }
};

// 滚动到激活标签
const scrollToActiveTag = () => {
  nextTick(() => {
    const activeTag = document.querySelector(
      ".tag-item.is-active"
    ) as HTMLElement;
    if (activeTag && scrollbarRef.value) {
      const scrollContainer = scrollbarRef.value.$refs.wrap;
      // 检查 scrollContainer 是否存在
      if (!scrollContainer) {
        return;
      }

      const offsetLeft = activeTag.offsetLeft;
      const tagWidth = activeTag.offsetWidth;
      const containerWidth = scrollContainer.offsetWidth;
      const scrollLeft = scrollContainer.scrollLeft;

      if (offsetLeft < scrollLeft) {
        scrollContainer.scrollLeft = offsetLeft - 20;
      } else if (offsetLeft + tagWidth > scrollLeft + containerWidth) {
        scrollContainer.scrollLeft =
          offsetLeft + tagWidth - containerWidth + 20;
      }
    }
  });
};

// 监听路由变化
router.beforeEach(to => {
  // 在路由跳转前添加标签，但避免重复添加
  if (to.path && to.meta?.title) {
    const existingTag = tagsList.value.find(tag => tag.path === to.path);
    if (!existingTag) {
      const tag: any = {
        path: to.path,
        name: to.name as string,
        title: to.meta.title as string,
        keepAlive: to.meta.keepAlive as boolean,
        affix: to.meta.affix as boolean,
        close: !to.meta.affix
      };
      addTag(tag);
    }
  }
});

router.afterEach(() => {
  scrollToActiveTag();
});

// 生命周期
onMounted(() => {
  initTags();
  // 移除重复的addCurrentRouteTag调用，因为router.beforeEach已经处理了
  scrollToActiveTag();

  // 添加全局点击事件监听
  document.addEventListener("click", hideContextMenu);

  // 开发环境下暴露清理函数
  if (import.meta.env.DEV) {
    (window as any).cleanTags = cleanDuplicateTags;
    console.log("开发模式：可使用 window.cleanTags() 清理重复标签");
  }
});

onUnmounted(() => {
  document.removeEventListener("click", hideContextMenu);
});
</script>

<style lang="scss" scoped>
.tags-container {
  height: 40px;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  position: relative;

  .tags-wrapper {
    height: 100%;
    display: flex;
    align-items: center;

    .tags-scrollbar {
      flex: 1;
      height: 100%;

      :deep(.el-scrollbar__wrap) {
        height: 100%;
      }

      :deep(.el-scrollbar__view) {
        height: 100%;
        display: flex;
        align-items: center;
      }
    }

    .tags-content {
      height: 100%;
      display: flex;
      align-items: center;
      padding: 0 8px;

      .tags-list {
        display: flex;
        align-items: center;
        gap: 4px;
        height: 100%;
      }

      .tag-item {
        display: flex;
        align-items: center;
        height: 28px;
        padding: 0 12px;
        background: var(--el-color-info-light-9);
        border: 1px solid var(--el-border-color-light);
        border-radius: 3px;
        cursor: pointer;
        user-select: none;
        white-space: nowrap;
        transition: all 0.3s;
        position: relative;

        &:hover {
          background: var(--el-color-primary-light-9);
          border-color: var(--el-color-primary-light-6);
          color: var(--el-color-primary);

          .tag-close {
            opacity: 1;
          }
        }

        &.is-active {
          background: var(--el-color-primary);
          border-color: var(--el-color-primary);
          color: white;

          .tag-close {
            opacity: 1;
            color: white;

            &:hover {
              background: rgba(255, 255, 255, 0.2);
            }
          }
        }

        &.is-affix {
          background: var(--el-color-warning-light-9);
          border-color: var(--el-color-warning-light-6);
        }

        .tag-title {
          font-size: 12px;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tag-close {
          width: 14px;
          height: 14px;
          margin-left: 4px;
          border-radius: 50%;
          opacity: 0;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;

          &:hover {
            background: rgba(0, 0, 0, 0.1);
          }
        }
      }
    }

    .tags-actions {
      width: 40px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-left: 1px solid var(--el-border-color-light);
    }
  }
}

// 右键菜单
.context-menu {
  position: fixed;
  z-index: 9999;
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 4px 0;
  min-width: 120px;

  .context-menu-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 13px;
    color: var(--el-text-color-primary);
    transition: background-color 0.3s;

    &:hover {
      background: var(--el-color-primary-light-9);
      color: var(--el-color-primary);
    }

    .el-icon {
      margin-right: 8px;
      font-size: 14px;
    }
  }
}

.context-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9998;
}

// 标签过渡动画
.tag-enter-active,
.tag-leave-active {
  transition: all 0.3s ease;
}

.tag-enter-from,
.tag-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

// 卡片模式样式
.tags-card {
  .tag-item {
    border-radius: 6px;
    margin-right: 2px;
  }
}

// 暗色主题
.dark-mode {
  background: var(--el-bg-color-page);
  border-bottom-color: var(--el-border-color);

  .tags-actions {
    border-left-color: var(--el-border-color);
  }

  .context-menu {
    background: var(--el-bg-color-page);
    border-color: var(--el-border-color);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .tags-container {
    .tag-item {
      .tag-title {
        max-width: 80px;
      }
    }
  }
}
</style>
