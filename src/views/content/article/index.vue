<template>
  <div class="content-article-container">
    <div class="page-header">
      <h2>文章管理</h2>
      <p>管理文章内容，包括发布、编辑、删除等功能</p>
    </div>

    <div class="page-content">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>文章列表</span>
            <el-button type="primary" :icon="Plus" @click="handleAdd">
              新增文章
            </el-button>
          </div>
        </template>

        <el-table :data="articleList" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="title" label="文章标题" min-width="200" />
          <el-table-column prop="category" label="分类" width="120" />
          <el-table-column prop="author" label="作者" width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="views" label="阅读量" width="100" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button
                size="small"
                :icon="View"
                @click="handleView(scope.row)"
              >
                预览
              </el-button>
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
import { Plus, Edit, Delete, View } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

const articleList = ref([
  {
    id: 1,
    title: "Vue 3 组合式API详解",
    category: "前端开发",
    author: "张三",
    status: "published",
    views: 1234,
    createTime: "2024-01-01 10:00:00"
  },
  {
    id: 2,
    title: "TypeScript 高级类型使用指南",
    category: "前端开发",
    author: "李四",
    status: "draft",
    views: 567,
    createTime: "2024-01-02 14:30:00"
  },
  {
    id: 3,
    title: "Node.js 性能优化实践",
    category: "后端开发",
    author: "王五",
    status: "published",
    views: 890,
    createTime: "2024-01-03 09:15:00"
  },
  {
    id: 4,
    title: "数据库索引优化策略",
    category: "数据库",
    author: "赵六",
    status: "review",
    views: 456,
    createTime: "2024-01-04 16:45:00"
  }
]);

const getStatusType = (
  status: string
): "success" | "info" | "warning" | "danger" => {
  const statusMap: Record<string, "success" | "info" | "warning" | "danger"> = {
    published: "success",
    draft: "info",
    review: "warning",
    archived: "danger"
  };
  return statusMap[status] || "info";
};

const getStatusText = (status: string) => {
  const statusMap = {
    published: "已发布",
    draft: "草稿",
    review: "审核中",
    archived: "已归档"
  };
  return statusMap[status as keyof typeof statusMap] || "未知";
};

const handleAdd = () => {
  ElMessage.info("新增文章功能");
};

const handleView = (row: any) => {
  ElMessage.info(`预览文章: ${row.title}`);
};

const handleEdit = (row: any) => {
  ElMessage.info(`编辑文章: ${row.title}`);
};

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除文章 "${row.title}" 吗？`, "警告", {
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
  console.log("文章管理页面已加载");
});
</script>

<style lang="scss" scoped>
.content-article-container {
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
