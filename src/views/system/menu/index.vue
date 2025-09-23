<template>
  <div class="system-menu-container">
    <div class="page-header">
      <h2>菜单管理</h2>
      <p>管理系统菜单结构，配置菜单权限</p>
    </div>

    <div class="page-content">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>菜单列表</span>
            <el-button type="primary" :icon="Plus" @click="handleAdd">
              新增菜单
            </el-button>
          </div>
        </template>

        <el-table
          :data="menuList"
          style="width: 100%"
          row-key="id"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column prop="meta.title" label="菜单名称" min-width="150" />
          <el-table-column prop="name" label="路由名称" width="150" />
          <el-table-column prop="path" label="路由路径" width="200" />
          <el-table-column prop="meta.icon" label="图标" width="100">
            <template #default="scope">
              <component
                :is="getIconComponent(scope.row.meta?.icon)"
                v-if="scope.row.meta?.icon"
                class="menu-icon"
              />
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="meta.hidden" label="是否隐藏" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.meta?.hidden ? 'danger' : 'success'">
                {{ scope.row.meta?.hidden ? "隐藏" : "显示" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="meta.keepAlive" label="缓存" width="80">
            <template #default="scope">
              <el-tag
                :type="scope.row.meta?.keepAlive ? 'success' : 'info'"
                size="small"
              >
                {{ scope.row.meta?.keepAlive ? "是" : "否" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button
                size="small"
                :icon="Edit"
                @click="handleEdit(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                size="small"
                :icon="Plus"
                @click="handleAddChild(scope.row)"
                v-if="!scope.row.parentId"
              >
                添加子菜单
              </el-button>
              <el-button
                size="small"
                type="danger"
                :icon="Delete"
                @click="handleDelete(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  Plus,
  Edit,
  Delete,
  HomeFilled,
  User,
  UserFilled,
  Document,
  Setting,
  Operation,
  Menu as MenuIcon,
  EditPen,
  FolderOpened,
  Cpu,
  Monitor,
  Platform,
  Warning
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

const menuList = ref([
  {
    id: "home",
    path: "/home",
    name: "Home",
    meta: {
      title: "首页",
      icon: "HomeFilled",
      affix: true,
      keepAlive: true,
      hidden: false
    }
  },
  {
    id: "system",
    path: "/system",
    name: "System",
    meta: {
      title: "系统管理",
      icon: "Setting",
      hidden: false
    },
    children: [
      {
        id: "system-user",
        parentId: "system",
        path: "/system/user",
        name: "SystemUser",
        meta: {
          title: "用户管理",
          icon: "User",
          keepAlive: true,
          hidden: false
        }
      },
      {
        id: "system-role",
        parentId: "system",
        path: "/system/role",
        name: "SystemRole",
        meta: {
          title: "角色管理",
          icon: "UserFilled",
          keepAlive: true,
          hidden: false
        }
      },
      {
        id: "system-menu",
        parentId: "system",
        path: "/system/menu",
        name: "SystemMenu",
        meta: {
          title: "菜单管理",
          icon: "Menu",
          keepAlive: true,
          hidden: false
        }
      }
    ]
  },
  {
    id: "content",
    path: "/content",
    name: "Content",
    meta: {
      title: "内容管理",
      icon: "Document",
      hidden: false
    },
    children: [
      {
        id: "content-article",
        parentId: "content",
        path: "/content/article",
        name: "ContentArticle",
        meta: {
          title: "文章管理",
          icon: "EditPen",
          keepAlive: true,
          hidden: false
        }
      },
      {
        id: "content-category",
        parentId: "content",
        path: "/content/category",
        name: "ContentCategory",
        meta: {
          title: "分类管理",
          icon: "FolderOpened",
          keepAlive: true,
          hidden: false
        }
      }
    ]
  }
]);

const iconMap = {
  HomeFilled,
  User,
  UserFilled,
  Document,
  Setting,
  Operation,
  Menu: MenuIcon,
  EditPen,
  FolderOpened,
  Cpu,
  Monitor,
  Platform,
  Warning
};

const getIconComponent = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || MenuIcon;
};

const handleAdd = () => {
  ElMessage.info("新增菜单功能");
};

const handleEdit = (row: any) => {
  ElMessage.info(`编辑菜单: ${row.meta.title}`);
};

const handleAddChild = (row: any) => {
  ElMessage.info(`为 "${row.meta.title}" 添加子菜单`);
};

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除菜单 "${row.meta.title}" 吗？`,
      "警告",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    );
    ElMessage.success("删除成功");
  } catch {
    ElMessage.info("取消删除");
  }
};

onMounted(() => {
  console.log("菜单管理页面已加载");
});
</script>

<style lang="scss" scoped>
.system-menu-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;

  h2 {
    margin: 0 0 8px 0;
    color: var(--el-text-color-primary);
  }

  p {
    margin: 0;
    color: var(--el-text-color-regular);
    font-size: 14px;
  }
}

.page-content {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.menu-icon {
  width: 16px;
  height: 16px;
}
</style>
