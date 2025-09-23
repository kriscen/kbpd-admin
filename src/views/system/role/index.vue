<template>
  <div class="system-role-container">
    <div class="page-header">
      <h2>角色管理</h2>
      <p>管理系统角色信息，配置角色权限</p>
    </div>

    <div class="page-content">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>角色列表</span>
            <el-button type="primary" :icon="Plus" @click="handleAdd">
              新增角色
            </el-button>
          </div>
        </template>

        <el-table :data="roleList" style="width: 100%">
          <el-table-column prop="id" label="角色ID" width="80" />
          <el-table-column prop="name" label="角色名称" width="150" />
          <el-table-column prop="code" label="角色编码" width="150" />
          <el-table-column
            prop="description"
            label="角色描述"
            min-width="200"
          />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag
                :type="scope.row.status === 'active' ? 'success' : 'danger'"
              >
                {{ scope.row.status === "active" ? "启用" : "禁用" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" />
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
                :icon="Key"
                @click="handlePermission(scope.row)"
              >
                权限
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
import { Plus, Edit, Delete, Key } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

const roleList = ref([
  {
    id: 1,
    name: "平台管理员",
    code: "PLATFORM_ADMIN",
    description: "平台最高管理员，拥有所有权限",
    status: "active",
    createTime: "2024-01-01 10:00:00"
  },
  {
    id: 2,
    name: "系统管理员",
    code: "SYSTEM_ADMIN",
    description: "系统管理员，负责系统配置和用户管理",
    status: "active",
    createTime: "2024-01-01 10:00:00"
  },
  {
    id: 3,
    name: "普通用户",
    code: "NORMAL_USER",
    description: "普通用户，只能访问基本功能",
    status: "active",
    createTime: "2024-01-01 10:00:00"
  }
]);

const handleAdd = () => {
  ElMessage.info("新增角色功能");
};

const handleEdit = (row: any) => {
  ElMessage.info(`编辑角色: ${row.name}`);
};

const handlePermission = (row: any) => {
  ElMessage.info(`配置角色权限: ${row.name}`);
};

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除角色 "${row.name}" 吗？`, "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    });
    ElMessage.success("删除成功");
  } catch {
    ElMessage.info("取消删除");
  }
};

onMounted(() => {
  console.log("角色管理页面已加载");
});
</script>

<style lang="scss" scoped>
.system-role-container {
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
</style>
