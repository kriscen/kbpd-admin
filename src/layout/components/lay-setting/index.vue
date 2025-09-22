<template>
  <el-drawer
    v-model="visible"
    title="布局设置"
    size="320px"
    direction="rtl"
    class="setting-drawer"
  >
    <div class="setting-content">
      <!-- 布局模式 -->
      <div class="setting-section">
        <div class="section-title">
          <el-icon><Grid /></el-icon>
          <span>布局模式</span>
        </div>
        <div class="layout-modes">
          <div
            v-for="mode in layoutModes"
            :key="mode.value"
            class="layout-mode-item"
            :class="{ 'is-active': layoutConfig.layout === mode.value }"
            @click="setLayout(mode.value)"
          >
            <div class="mode-preview" :class="`mode-${mode.value}`">
              <div class="preview-sidebar"></div>
              <div class="preview-content">
                <div class="preview-header"></div>
                <div class="preview-main"></div>
              </div>
            </div>
            <span class="mode-name">{{ mode.label }}</span>
          </div>
        </div>
      </div>

      <!-- 主题配置 -->
      <div class="setting-section">
        <div class="section-title">
          <el-icon><Sunny /></el-icon>
          <span>主题配置</span>
        </div>

        <!-- 整体风格 -->
        <div class="setting-item">
          <span class="item-label">整体风格</span>
          <el-radio-group
            :model-value="overallStyle"
            size="small"
            @change="val => setOverallStyle(val as OverallStyleType)"
          >
            <el-radio-button label="light">明亮</el-radio-button>
            <el-radio-button label="dark">暗黑</el-radio-button>
            <el-radio-button label="system">跟随系统</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 主题色 -->
        <div class="setting-item">
          <span class="item-label">主题色</span>
          <div class="theme-colors">
            <div
              v-for="color in themeColors"
              :key="color.themeColor"
              class="color-item"
              :style="{ backgroundColor: color.color }"
              :class="{
                'is-active': layoutConfig.epThemeColor === color.color
              }"
              @click="setThemeColor(color.color)"
            >
              <el-icon v-if="layoutConfig.epThemeColor === color.color">
                <Check />
              </el-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- 功能配置 -->
      <div class="setting-section">
        <div class="section-title">
          <el-icon><Tools /></el-icon>
          <span>功能配置</span>
        </div>

        <div class="setting-item">
          <span class="item-label">固定头部</span>
          <el-switch :model-value="true" disabled />
        </div>

        <div class="setting-item">
          <span class="item-label">显示标签页</span>
          <el-switch
            :model-value="!layoutConfig.hideTabs"
            @change="val => updateConfig('hideTabs', !val)"
          />
        </div>

        <div class="setting-item">
          <span class="item-label">显示页脚</span>
          <el-switch
            :model-value="!layoutConfig.hideFooter"
            @change="val => updateConfig('hideFooter', !val)"
          />
        </div>

        <div class="setting-item">
          <span class="item-label">页面缓存</span>
          <el-switch
            :model-value="layoutConfig.isKeepAlive"
            @change="val => updateConfig('isKeepAlive', val)"
          />
        </div>

        <div class="setting-item">
          <span class="item-label">标签页持久化</span>
          <el-switch
            :model-value="layoutConfig.multiTagsCache"
            @change="val => updateConfig('multiTagsCache', val)"
          />
        </div>

        <div class="setting-item">
          <span class="item-label">内容区拉伸</span>
          <el-switch
            :model-value="layoutConfig.stretch"
            @change="val => updateConfig('stretch', val)"
          />
        </div>

        <div class="setting-item">
          <span class="item-label">灰色模式</span>
          <el-switch
            :model-value="grayMode"
            @change="val => toggleGrayMode(val as boolean)"
          />
        </div>

        <div class="setting-item">
          <span class="item-label">色弱模式</span>
          <el-switch
            :model-value="weakMode"
            @change="val => toggleWeakMode(val as boolean)"
          />
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="setting-actions">
        <el-button type="primary" @click="copyConfig">
          <el-icon><CopyDocument /></el-icon>
          复制配置
        </el-button>
        <el-button @click="resetConfig">
          <el-icon><RefreshLeft /></el-icon>
          重置配置
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import {
  Grid,
  Sunny,
  Tools,
  Check,
  CopyDocument,
  RefreshLeft
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useLayout } from "../../hooks/useLayout";
import { useDataThemeChange } from "../../hooks/useDataThemeChange";
import type { LayoutType, OverallStyleType } from "../../types";

// 组合式函数
const {
  layoutConfig,
  setLayout: setLayoutMode,
  updateConfig,
  resetConfig: resetLayoutConfig
} = useLayout();

const {
  overallStyle,
  themeColors,
  setOverallStyle,
  setThemeColor: setThemeColorValue,
  grayMode,
  weakMode,
  toggleGrayMode,
  toggleWeakMode
} = useDataThemeChange();

// 状态
const visible = ref(false);

// 布局模式选项
const layoutModes = [
  { label: "垂直", value: "vertical" as LayoutType },
  { label: "水平", value: "horizontal" as LayoutType },
  { label: "混合", value: "mix" as LayoutType }
];

// 方法
const setLayout = (layout: LayoutType) => {
  setLayoutMode(layout);
};

const setThemeColor = (color: string) => {
  setThemeColorValue(color);
  updateConfig("epThemeColor", color);
};

const copyConfig = async () => {
  try {
    const config = JSON.stringify(layoutConfig.value, null, 2);
    await navigator.clipboard.writeText(config);
    ElMessage.success("配置已复制到剪贴板");
  } catch (error) {
    ElMessage.error("复制失败，请手动复制");
  }
};

const resetConfig = () => {
  resetLayoutConfig();
  ElMessage.success("配置已重置");
};

// 显示设置面板
const showSettings = () => {
  visible.value = true;
};

// 隐藏设置面板
const hideSettings = () => {
  visible.value = false;
};

// 监听设置面板显示事件
const handleShowSettings = () => {
  showSettings();
};

// 生命周期
onMounted(() => {
  window.addEventListener("show-settings", handleShowSettings);
});

onUnmounted(() => {
  window.removeEventListener("show-settings", handleShowSettings);
});
</script>

<style lang="scss" scoped>
.setting-drawer {
  :deep(.el-drawer__header) {
    margin-bottom: 0;
    padding: 20px 20px 0;
    border-bottom: 1px solid var(--el-border-color-light);
  }

  :deep(.el-drawer__body) {
    padding: 0;
  }
}

.setting-content {
  height: 100%;
  overflow-y: auto;
  padding: 20px;

  .setting-section {
    margin-bottom: 30px;

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin-bottom: 16px;

      .el-icon {
        color: var(--el-color-primary);
      }
    }

    .setting-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid var(--el-border-color-lighter);

      &:last-child {
        border-bottom: none;
      }

      .item-label {
        font-size: 14px;
        color: var(--el-text-color-primary);
      }
    }
  }

  .layout-modes {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;

    .layout-mode-item {
      cursor: pointer;
      text-align: center;
      padding: 12px;
      border: 2px solid var(--el-border-color-light);
      border-radius: 6px;
      transition: all 0.3s;

      &:hover {
        border-color: var(--el-color-primary-light-6);
      }

      &.is-active {
        border-color: var(--el-color-primary);
        background: var(--el-color-primary-light-9);
      }

      .mode-preview {
        width: 60px;
        height: 45px;
        margin: 0 auto 8px;
        border: 1px solid var(--el-border-color-light);
        border-radius: 3px;
        position: relative;
        overflow: hidden;

        &.mode-vertical {
          display: flex;

          .preview-sidebar {
            width: 20px;
            height: 100%;
            background: var(--el-color-primary-light-8);
          }

          .preview-content {
            flex: 1;
            display: flex;
            flex-direction: column;

            .preview-header {
              height: 12px;
              background: var(--el-color-info-light-8);
            }

            .preview-main {
              flex: 1;
              background: var(--el-color-info-light-9);
            }
          }
        }

        &.mode-horizontal {
          display: flex;
          flex-direction: column;

          .preview-header {
            height: 15px;
            background: var(--el-color-primary-light-8);
          }

          .preview-main {
            flex: 1;
            background: var(--el-color-info-light-9);
          }
        }

        &.mode-mix {
          display: flex;
          flex-direction: column;

          .preview-header {
            height: 12px;
            background: var(--el-color-primary-light-8);
          }

          .preview-content {
            flex: 1;
            display: flex;

            .preview-sidebar {
              width: 18px;
              background: var(--el-color-primary-light-9);
            }

            .preview-main {
              flex: 1;
              background: var(--el-color-info-light-9);
            }
          }
        }
      }

      .mode-name {
        font-size: 12px;
        color: var(--el-text-color-regular);
      }
    }
  }

  .theme-colors {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;

    .color-item {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      position: relative;

      &:hover {
        transform: scale(1.1);
      }

      &.is-active {
        transform: scale(1.2);
        box-shadow:
          0 0 0 2px white,
          0 0 0 4px currentColor;

        .el-icon {
          color: white;
          font-size: 12px;
        }
      }
    }
  }

  .setting-actions {
    position: sticky;
    bottom: 0;
    background: var(--el-bg-color);
    padding: 16px 0;
    border-top: 1px solid var(--el-border-color-light);
    display: flex;
    gap: 12px;

    .el-button {
      flex: 1;
    }
  }
}

// 滚动条样式
.setting-content {
  &::-webkit-scrollbar {
    width: 6px;
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
</style>
