<template>
  <template v-if="!item.meta?.hidden">
    <!-- 没有子菜单或只有一个子菜单且不强制显示父级的情况 -->
    <el-menu-item
      v-if="!hasVisibleChildren || (hasOnlyOneChild && !alwaysShowParent)"
      :index="resolvePath"
      :class="{ 'is-active': isActive }"
    >
      <component :is="iconComponent" v-if="item.meta?.icon" class="menu-icon" />
      <template #title>
        <span class="menu-title">{{ getDisplayTitle }}</span>
      </template>
    </el-menu-item>

    <!-- 有多个子菜单或强制显示父级的情况 -->
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
        v-for="child in visibleChildren"
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
  UserFilled,
  WarningFilled,
  Document,
  Setting,
  Operation,
  Menu as MenuIcon,
  Edit,
  FolderOpened,
  Cpu,
  Monitor,
  Platform,
  Warning
} from "@element-plus/icons-vue";
import type { MenuItem } from "@/layout/types";

interface Props {
  item: MenuItem;
  basePath?: string;
  alwaysShow?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  basePath: "",
  alwaysShow: false
});

const route = useRoute();

// 解析完整路径
const resolvePath = computed(() => {
  if (props.item.path.startsWith("/")) {
    return props.item.path;
  }
  return `${props.basePath}/${props.item.path}`.replace(/\/+/g, "/");
});

// 获取可见的子菜单
const visibleChildren = computed(() => {
  if (!props.item.children) return [];
  return props.item.children.filter(child => !child.meta?.hidden);
});

// 是否有可见的子菜单
const hasVisibleChildren = computed(() => {
  return visibleChildren.value.length > 0;
});

// 是否只有一个子菜单
const hasOnlyOneChild = computed(() => {
  return visibleChildren.value.length === 1;
});

// 是否强制显示父级
const alwaysShowParent = computed(() => {
  return props.alwaysShow;
});

// 获取显示标题（单个子菜单时显示子菜单标题）
const getDisplayTitle = computed(() => {
  if (hasOnlyOneChild.value && !alwaysShowParent.value) {
    return (
      visibleChildren.value[0].meta?.title || visibleChildren.value[0].name
    );
  }
  return props.item.meta?.title || props.item.name;
});

// 是否为当前激活菜单
const isActive = computed(() => {
  if (hasOnlyOneChild.value && !alwaysShowParent.value) {
    const childPath = visibleChildren.value[0].path.startsWith("/")
      ? visibleChildren.value[0].path
      : `${resolvePath.value}/${visibleChildren.value[0].path}`.replace(
          /\/+/g,
          "/"
        );
    return route.path === childPath;
  }
  return route.path === resolvePath.value;
});

// 图标组件映射
const iconMap = {
  HomeFilled: HomeFilled,
  User: User,
  UserFilled: UserFilled,
  WarningFilled: WarningFilled,
  Document: Document,
  Setting: Setting,
  Operation: Operation,
  Menu: MenuIcon,
  Edit: Edit,
  FolderOpened: FolderOpened,
  Cpu: Cpu,
  Monitor: Monitor,
  Platform: Platform,
  Warning: Warning
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
