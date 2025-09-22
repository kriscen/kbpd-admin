<template>
  <div class="layout-footer" :class="footerClasses">
    <div class="footer-content">
      <div class="footer-left">
        <span class="copyright">
          © 2024 KBPD Admin. 基于 Vue 3 + TypeScript + Element Plus 构建
        </span>
      </div>
      <div class="footer-right">
        <span class="version">v1.0.0</span>
        <el-divider direction="vertical" />
        <a href="#" class="footer-link">文档</a>
        <el-divider direction="vertical" />
        <a href="#" class="footer-link">帮助</a>
        <el-divider direction="vertical" />
        <a href="#" class="footer-link">关于</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLayout } from "@/layout/hooks/useLayout";

const { layoutConfig } = useLayout();

const footerClasses = computed(() => [
  "layout-footer",
  {
    "dark-mode": layoutConfig.value.darkMode
  }
]);
</script>

<style lang="scss" scoped>
.layout-footer {
  height: 50px;
  background: var(--el-bg-color);
  border-top: 1px solid var(--el-border-color-light);
  padding: 0 20px;

  .footer-content {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    color: var(--el-text-color-secondary);

    .footer-left {
      .copyright {
        color: var(--el-text-color-regular);
      }
    }

    .footer-right {
      display: flex;
      align-items: center;
      gap: 8px;

      .version {
        color: var(--el-color-primary);
        font-weight: 500;
      }

      .footer-link {
        color: var(--el-text-color-regular);
        text-decoration: none;
        transition: color 0.3s;

        &:hover {
          color: var(--el-color-primary);
        }
      }

      :deep(.el-divider--vertical) {
        height: 12px;
        margin: 0 4px;
      }
    }
  }
}

// 暗色主题
.dark-mode {
  background: var(--el-bg-color-page);
  border-top-color: var(--el-border-color);
}

// 响应式设计
@media (max-width: 768px) {
  .layout-footer {
    padding: 0 12px;

    .footer-content {
      font-size: 12px;

      .footer-right {
        .footer-link {
          display: none;
        }

        :deep(.el-divider--vertical) {
          display: none;
        }
      }
    }
  }
}
</style>
