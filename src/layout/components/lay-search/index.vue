<template>
  <el-dialog
    v-model="visible"
    title="全局搜索"
    width="600px"
    :before-close="handleClose"
    class="search-dialog"
  >
    <div class="search-content">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索菜单..."
        size="large"
        clearable
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <div v-if="searchResults.length > 0" class="search-results">
        <div class="result-title">搜索结果 ({{ searchResults.length }})</div>
        <div
          v-for="(item, index) in searchResults"
          :key="index"
          class="result-item"
          @click="handleResultClick(item)"
        >
          <el-icon v-if="item.icon" class="result-icon">
            <component :is="getIconComponent(item.icon)" />
          </el-icon>
          <div class="result-content">
            <div class="result-name">{{ item.title }}</div>
            <div class="result-path">{{ item.path }}</div>
          </div>
        </div>
      </div>

      <div v-else-if="searchKeyword" class="no-results">
        <el-empty description="未找到相关结果" />
      </div>

      <div v-else class="search-tips">
        <div class="tip-title">搜索提示</div>
        <div class="tip-item">
          <el-icon><Search /></el-icon>
          <span>输入关键词搜索菜单</span>
        </div>
        <div class="tip-item">
          <el-icon><Key /></el-icon>
          <span>按 Enter 快速访问第一个结果</span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import {
  Search,
  Key,
  HomeFilled,
  User,
  WarningFilled
} from "@element-plus/icons-vue";

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const router = useRouter();

// 搜索关键词
const searchKeyword = ref("");

// 模拟菜单数据
const menuData = [
  { title: "首页", path: "/", icon: "HomeFilled" },
  { title: "登录", path: "/login", icon: "User" },
  { title: "404页面", path: "/404", icon: "WarningFilled" }
];

// 弹窗显示状态
const visible = computed({
  get: () => props.modelValue,
  set: value => emit("update:modelValue", value)
});

// 搜索结果
const searchResults = computed(() => {
  if (!searchKeyword.value) return [];

  const keyword = searchKeyword.value.toLowerCase();
  return menuData.filter(
    item =>
      item.title.toLowerCase().includes(keyword) ||
      item.path.toLowerCase().includes(keyword)
  );
});

// 图标组件映射
const iconMap = {
  HomeFilled: HomeFilled,
  User: User,
  WarningFilled: WarningFilled
};

const getIconComponent = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || Search;
};

// 搜索处理
const handleSearch = () => {
  // 搜索逻辑已在计算属性中处理
};

// 结果点击处理
const handleResultClick = (item: any) => {
  router.push(item.path);
  visible.value = false;
};

// 关闭处理
const handleClose = () => {
  searchKeyword.value = "";
  visible.value = false;
};

// 监听弹窗显示状态，自动聚焦输入框
watch(visible, newVal => {
  if (newVal) {
    setTimeout(() => {
      const input = document.querySelector(
        ".search-dialog .el-input__inner"
      ) as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }, 100);
  } else {
    searchKeyword.value = "";
  }
});
</script>

<style lang="scss" scoped>
.search-dialog {
  :deep(.el-dialog__body) {
    padding: 20px;
  }
}

.search-content {
  .search-results {
    margin-top: 20px;
    max-height: 400px;
    overflow-y: auto;

    .result-title {
      font-size: 14px;
      color: var(--el-text-color-secondary);
      margin-bottom: 12px;
      padding-left: 8px;
    }

    .result-item {
      display: flex;
      align-items: center;
      padding: 12px;
      cursor: pointer;
      border-radius: 6px;
      transition: background-color 0.3s;

      &:hover {
        background-color: var(--el-color-primary-light-9);
      }

      .result-icon {
        width: 20px;
        height: 20px;
        margin-right: 12px;
        color: var(--el-color-primary);
      }

      .result-content {
        flex: 1;

        .result-name {
          font-size: 14px;
          color: var(--el-text-color-primary);
          font-weight: 500;
        }

        .result-path {
          font-size: 12px;
          color: var(--el-text-color-secondary);
          margin-top: 2px;
        }
      }
    }
  }

  .no-results {
    margin-top: 40px;
    text-align: center;
  }

  .search-tips {
    margin-top: 20px;

    .tip-title {
      font-size: 14px;
      color: var(--el-text-color-primary);
      font-weight: 500;
      margin-bottom: 12px;
    }

    .tip-item {
      display: flex;
      align-items: center;
      padding: 8px 0;
      color: var(--el-text-color-secondary);
      font-size: 13px;

      .el-icon {
        margin-right: 8px;
        color: var(--el-color-primary);
      }
    }
  }
}
</style>
