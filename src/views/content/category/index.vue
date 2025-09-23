<template>
  <div class="content-category-container">
    <div class="page-header">
      <h2>分类管理</h2>
      <p>管理文章分类，组织内容结构</p>
    </div>

    <div class="page-content">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>分类列表</span>
            <el-button type="primary" :icon="Plus" @click="handleAdd">
              新增分类
            </el-button>
          </div>
        </template>

        <el-table
          :data="categoryList"
          style="width: 100%"
          row-key="id"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column prop="name" label="分类名称" min-width="200" />
          <el-table-column prop="code" label="分类编码" width="150" />
          <el-table-column prop="description" label="描述" min-width="200" />
          <el-table-column prop="sort" label="排序" width="80" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag
                :type="scope.row.status === 'active' ? 'success' : 'danger'"
              >
                {{ scope.row.status === "active" ? "启用" : "禁用" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="articleCount" label="文章数量" width="100" />
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
                :icon="Plus"
                @click="handleAddChild(scope.row)"
                v-if="!scope.row.parentId"
              >
                添加子分类
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

const categoryList = ref([
  {
    id: 1,
    name: "技术开发",
    code: "tech",
    description: "技术相关文章分类",
    sort: 1,
    status: "active",
    articleCount: 25,
    createTime: "2024-01-01 10:00:00",
    children: [
      {
        id: 11,
        parentId: 1,
        name: "前端开发",
        code: "frontend",
        description: "前端技术相关文章",
        sort: 1,
        status: "active",
        articleCount: 15,
        createTime: "2024-01-01 11:00:00"
      },
      {
        id: 12,
        parentId: 1,
        name: "后端开发",
        code: "backend",
        description: "后端技术相关文章",
        sort: 2,
        status: "active",
        articleCount: 10,
        createTime: "2024-01-01 12:00:00"
      }
    ]
  },
  {
    id: 2,
    name: "产品设计",
    code: "design",
    description: "产品设计相关文章",
    sort: 2,
    status: "active",
    articleCount: 8,
    createTime: "2024-01-02 10:00:00",
    children: [
      {
        id: 21,
        parentId: 2,
        name: "UI设计",
        code: "ui",
        description: "用户界面设计",
        sort: 1,
        status: "active",
        articleCount: 5,
        createTime: "2024-01-02 11:00:00"
      },
      {
        id: 22,
        parentId: 2,
        name: "UX设计",
        code: "ux",
        description: "用户体验设计",
        sort: 2,
        status: "active",
        articleCount: 3,
        createTime: "2024-01-02 12:00:00"
      }
    ]
  },
  {
    id: 3,
    name: "项目管理",
    code: "management",
    description: "项目管理相关文章",
    sort: 3,
    status: "active",
    articleCount: 5,
    createTime: "2024-01-03 10:00:00"
  }
]);

const handleAdd = () => {
  ElMessage.info("新增分类功能");
};

const handleEdit = (row: any) => {
  ElMessage.info(`编辑分类: ${row.name}`);
};

const handleAddChild = (row: any) => {
  ElMessage.info(`为 "${row.name}" 添加子分类`);
};

const handleDelete = async (row: any) => {
  if (row.articleCount > 0) {
    ElMessage.warning("该分类下还有文章，无法删除");
    return;
  }

  try {
    await ElMessageBox.confirm(`确定要删除分类 "${row.name}" 吗？`, "警告", {
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
  console.log("分类管理页面已加载");
});
</script>

<style lang="scss" scoped>
.content-category-container {
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
