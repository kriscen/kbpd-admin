<template>
  <template v-if="!item.meta?.hidden">
    <!-- 没有子菜单的情况 -->
    <el-menu-item
      v-if="!hasChildren"
      :index="resolvePath"
      :class="{ 'is-active': isActive }"
    >
      <component :is="iconComponent" v-if="item.meta?.icon" class="menu-icon" />
      <template #title>
        <span class="menu-title">{{ item.meta?.title || item.name }}</span>
      </template>
    </el-menu-item>

    <!-- 有子菜单的情况 -->
    <el-sub-menu v-else :index="resolvePath">
      <template #title>
        <component
          :is="iconComponent"
          v-if="item.meta?.icon"
          class="menu-icon"
        />
        <span class="menu-title">{{ item.meta?.title || item.name }}</span>
      </template>

      <SidebarItem
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath"
      />
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import {
  HomeFilled,
  User,
  WarningFilled,
  Document,
  Setting,
  Operation,
  Menu as MenuIcon
} from "@element-plus/icons-vue";
import type { MenuItem } from "@/layout/types";

interface Props {
  item: MenuItem;
  basePath?: string;
}

const props = withDefaults(defineProps<Props>(), {
  basePath: ""
});

const route = useRoute();

// 解析完整路径
const resolvePath = computed(() => {
  if (props.item.path.startsWith("/")) {
    return props.item.path;
  }
  return `${props.basePath}/${props.item.path}`.replace(/\/+/g, "/");
});

// 是否有子菜单
const hasChildren = computed(() => {
  return props.item.children && props.item.children.length > 0;
});

// 是否为当前激活菜单
const isActive = computed(() => {
  return route.path === resolvePath.value;
});

// 图标组件映射
const iconMap = {
  HomeFilled: HomeFilled,
  User: User,
  WarningFilled: WarningFilled,
  Document: Document,
  Setting: Setting,
  Operation: Operation,
  Menu: MenuIcon
};

// 图标组件
const iconComponent = computed(() => {
  const iconName = props.item.meta?.icon;
  return iconName
    ? iconMap[iconName as keyof typeof iconMap] || MenuIcon
    : MenuIcon;
});
</script>

<style lang="scss" scoped>
.menu-icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
}

.menu-title {
  font-size: 14px;
}
</style>
