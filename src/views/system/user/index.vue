<template>
  <div class="system-user-container">
    <div class="page-header">
      <h2>用户管理</h2>
      <p>管理系统用户信息，包括用户增删改查等功能</p>
    </div>

    <div class="page-content">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>用户列表</span>
            <el-button type="primary" :icon="Plus" @click="handleAdd">
              新增用户
            </el-button>
          </div>
        </template>

        <el-table :data="userList" style="width: 100%">
          <el-table-column prop="userId" label="用户ID" width="80" />
          <el-table-column prop="username" label="用户名" width="120" />
          <el-table-column prop="realName" label="真实姓名" width="120" />
          <el-table-column prop="email" label="邮箱" width="180" />
          <el-table-column prop="phone" label="手机号" width="130" />
          <el-table-column prop="department" label="部门" width="120" />
          <el-table-column prop="roles" label="角色" width="150">
            <template #default="scope">
              <el-tag
                v-for="role in scope.row.roles"
                :key="role"
                type="info"
                size="small"
                style="margin-right: 5px"
              >
                {{ role }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="120">
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
import { Plus, Edit, Delete } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

const userList = ref([
  {
    userId: 1,
    username: "admin",
    realName: "系统管理员",
    email: "admin@example.com",
    phone: "13800138000",
    department: "技术部",
    roles: ["平台管理员", "系统管理员"]
  },
  {
    userId: 2,
    username: "system",
    realName: "系统管理员",
    email: "system@example.com",
    phone: "13900139000",
    department: "运维部",
    roles: ["系统管理员"]
  },
  {
    userId: 3,
    username: "test",
    realName: "测试用户",
    email: "test@example.com",
    phone: "13700137000",
    department: "测试部",
    roles: ["普通用户"]
  }
]);

const handleAdd = () => {
  ElMessage.info("新增用户功能");
};

const handleEdit = (row: any) => {
  ElMessage.info(`编辑用户: ${row.username}`);
};

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${row.username}" 吗？`,
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
  console.log("用户管理页面已加载");
});
</script>

<style lang="scss" scoped>
.system-user-container {
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
