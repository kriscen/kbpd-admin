<template>
  <div class="content-404">
    <div class="error-content">
      <div class="error-image">
        <el-icon size="120" color="#909399">
          <WarningFilled />
        </el-icon>
      </div>
      <div class="error-info">
        <h1 class="error-title">404</h1>
        <h2 class="error-subtitle">抱歉，页面不存在</h2>
        <p class="error-description">
          您访问的页面可能已被删除、重命名或暂时不可用
        </p>
        <div class="error-actions">
          <el-button type="primary" @click="goHome">
            <el-icon><HomeFilled /></el-icon>
            返回首页
          </el-button>
          <el-button @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
            返回上页
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { WarningFilled, HomeFilled, ArrowLeft } from "@element-plus/icons-vue";

const router = useRouter();

const goHome = () => {
  router.push("/home");
};

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped lang="scss">
.content-404 {
  min-height: calc(100vh - 140px); // 减去头部和标签页高度
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-bg-color-page);
  padding: 40px 20px;

  .error-content {
    text-align: center;
    padding: 60px 40px;
    background: var(--el-bg-color);
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    max-width: 500px;
    margin: 20px;
    border: 1px solid var(--el-border-color-lighter);

    .error-image {
      margin-bottom: 30px;
      opacity: 0.8;
    }

    .error-info {
      .error-title {
        font-size: 72px;
        font-weight: 700;
        color: #909399;
        margin: 0 0 10px 0;
        line-height: 1;
      }

      .error-subtitle {
        font-size: 24px;
        font-weight: 500;
        color: var(--el-text-color-primary);
        margin: 0 0 15px 0;
      }

      .error-description {
        font-size: 16px;
        color: var(--el-text-color-secondary);
        margin: 0 0 40px 0;
        line-height: 1.6;
      }

      .error-actions {
        display: flex;
        gap: 16px;
        justify-content: center;
        flex-wrap: wrap;

        .el-button {
          padding: 12px 24px;
          font-size: 14px;
          border-radius: 8px;

          .el-icon {
            margin-right: 6px;
          }
        }
      }
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .content-404 {
    padding: 20px 12px;
    min-height: calc(100vh - 100px);

    .error-content {
      padding: 40px 24px;
      margin: 12px;
      border-radius: 16px;

      .error-info {
        .error-title {
          font-size: 56px;
        }

        .error-subtitle {
          font-size: 20px;
        }

        .error-description {
          font-size: 14px;
        }

        .error-actions {
          flex-direction: column;
          align-items: center;

          .el-button {
            width: 100%;
            max-width: 200px;
          }
        }
      }
    }
  }
}

// 暗色主题适配
.dark .content-404 {
  .error-content {
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  }
}
</style>
