<template>
  <div class="layout-content" :class="contentClasses">
    <router-view v-slot="{ Component, route }">
      <transition
        :name="transitionName"
        :enter-active-class="enterTransition"
        :leave-active-class="leaveTransition"
        mode="out-in"
        appear
      >
        <keep-alive v-if="isKeepAlive" :include="cachePageList">
          <component
            :is="Component"
            :key="route.fullPath"
            class="layout-page"
          />
        </keep-alive>
        <component
          v-else
          :is="Component"
          :key="route.fullPath"
          class="layout-page"
        />
      </transition>
    </router-view>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="content-loading">
      <el-loading text="页面加载中..." background="rgba(0, 0, 0, 0.1)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useLayout } from "@/layout/hooks/useLayout";

// 组合式函数
const { layoutConfig } = useLayout();
const route = useRoute();

// 状态
const isLoading = ref(false);

// 页面缓存列表 (模拟数据)
const cachePageList = ref(["Home", "Login"]);

// 计算属性
const isKeepAlive = computed(() => layoutConfig.value.isKeepAlive);

const contentClasses = computed(() => [
  "layout-content",
  {
    "content-stretch": layoutConfig.value.stretch,
    "content-fixed-header": true,
    "dark-mode": layoutConfig.value.darkMode
  }
]);

// 过渡动画配置
const transitions = computed(() => {
  // 可以根据路由配置不同的过渡动画
  return {
    name: "fade-transform",
    enterTransition: "animate__animated animate__fadeInRight",
    leaveTransition: "animate__animated animate__fadeOutLeft"
  };
});

const transitionName = computed(() => {
  return transitions.value.name;
});

const enterTransition = computed(() => {
  return transitions.value.enterTransition;
});

const leaveTransition = computed(() => {
  return transitions.value.leaveTransition;
});

// 监听路由变化，显示加载状态
watch(
  () => route.path,
  () => {
    isLoading.value = true;
    // 模拟页面加载时间
    setTimeout(() => {
      isLoading.value = false;
    }, 300);
  }
);
</script>

<style lang="scss" scoped>
.layout-content {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: var(--el-bg-color-page);
  min-height: calc(100vh - 110px); // 减去 header 和 footer 的高度

  &.content-stretch {
    margin: 0;
    padding: 0;
  }

  &.content-fixed-header {
    padding-top: 50px; // header 高度
  }

  .layout-page {
    height: 100%;
    overflow-y: auto;
    padding: 20px;
  }

  .content-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

// 过渡动画
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s ease;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

// 页面切换动画
@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes fadeOutLeft {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
}

.animate__animated {
  animation-duration: 0.3s;
  animation-fill-mode: both;
}

.animate__fadeInRight {
  animation-name: fadeInRight;
}

.animate__fadeOutLeft {
  animation-name: fadeOutLeft;
}

// 暗色主题
.dark-mode {
  background: var(--el-bg-color-page);

  .layout-page {
    background: transparent;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .layout-content {
    min-height: calc(100vh - 100px);

    .layout-page {
      padding: 12px;
    }
  }
}

// 滚动条样式
:deep(.layout-page) {
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--el-color-info-light-9);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--el-color-info-light-6);
    border-radius: 3px;

    &:hover {
      background: var(--el-color-info-light-4);
    }
  }
}

// 页面内容的通用样式
:deep(.page-container) {
  background: var(--el-bg-color);
  border-radius: 6px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:deep(.page-header) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--el-border-color-light);

  .page-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }
}

:deep(.page-content) {
  .el-card {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
