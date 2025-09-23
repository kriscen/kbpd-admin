<template>
  <div class="error-container">
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
.error-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

  .error-content {
    text-align: center;
    padding: 60px 40px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    margin: 20px;

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
  .error-container {
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
</style>
