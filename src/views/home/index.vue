<template>
  <div class="home-container">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <el-card class="welcome-card">
        <div class="welcome-content">
          <div class="welcome-text">
            <h2>{{ getGreeting() }}{{ userInfo?.username || "用户" }}!</h2>
            <p>欢迎进入KBPD后台管理系统，今天是{{ getCurrentDate() }}</p>
          </div>
          <div class="welcome-avatar">
            <el-avatar :size="80" :src="userInfo?.avatar">
              <el-icon size="40"><User /></el-icon>
            </el-avatar>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 数据统计区域 -->
    <div class="stats-section">
      <el-row :gutter="20">
        <el-col
          :xs="24"
          :sm="12"
          :md="6"
          v-for="(stat, index) in statsData"
          :key="index"
        >
          <el-card class="stats-card" shadow="hover">
            <div class="stats-content">
              <div class="stats-icon">
                <el-icon :size="32" :color="stat.color">
                  <component :is="stat.icon" />
                </el-icon>
              </div>
              <div class="stats-info">
                <div class="stats-value">{{ stat.value }}</div>
                <div class="stats-label">{{ stat.label }}</div>
                <div class="stats-trend">
                  <el-icon :color="stat.trend > 0 ? '#67c23a' : '#f56c6c'">
                    <ArrowUp v-if="stat.trend > 0" />
                    <ArrowDown v-else />
                  </el-icon>
                  <span
                    :style="{ color: stat.trend > 0 ? '#67c23a' : '#f56c6c' }"
                  >
                    {{ Math.abs(stat.trend) }}%
                  </span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 主要内容区域 -->
    <el-row :gutter="20" class="main-content"> </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, markRaw } from "vue";
import { ElMessage } from "element-plus";
import {
  User,
  DataAnalysis,
  Monitor,
  UserFilled,
  ShoppingBag,
  ArrowUp,
  ArrowDown,
  Plus,
  Setting,
  Document,
  DataBoard
} from "@element-plus/icons-vue";
import { useUserStore } from "@/store/user";

const userStore = useUserStore();

// 用户信息
const userInfo = computed(() => userStore.userInfo);

// 图表引用
const chartRef = ref();

// 统计数据
const statsData = ref([
  {
    label: "总用户数",
    value: "1,234",
    icon: markRaw(UserFilled),
    color: "#409eff",
    trend: 12.5
  },
  {
    label: "今日访问",
    value: "856",
    icon: markRaw(Monitor),
    color: "#67c23a",
    trend: 8.2
  },
  {
    label: "订单数量",
    value: "2,468",
    icon: markRaw(ShoppingBag),
    color: "#e6a23c",
    trend: -2.1
  },
  {
    label: "数据分析",
    value: "89.3%",
    icon: markRaw(DataAnalysis),
    color: "#f56c6c",
    trend: 5.7
  }
]);

// 快捷操作
const quickActions = ref([
  {
    label: "新建项目",
    icon: markRaw(Plus),
    color: "#409eff",
    action: "create-project"
  },
  {
    label: "系统设置",
    icon: markRaw(Setting),
    color: "#909399",
    action: "system-settings"
  },
  {
    label: "数据报告",
    icon: markRaw(Document),
    color: "#67c23a",
    action: "data-report"
  },
  {
    label: "数据面板",
    icon: markRaw(DataBoard),
    color: "#e6a23c",
    action: "dashboard"
  }
]);

// 最近动态
const recentActivities = ref([
  {
    title: "系统更新",
    description: "系统已更新到v1.2.0版本，新增多项功能",
    time: "2小时前",
    color: "#409eff"
  },
  {
    title: "数据备份",
    description: "定时数据备份任务执行成功",
    time: "6小时前",
    color: "#67c23a"
  },
  {
    title: "用户登录",
    description: "管理员admin登录系统",
    time: "1天前",
    color: "#e6a23c"
  },
  {
    title: "安全检查",
    description: "系统安全扫描完成，未发现异常",
    time: "2天前",
    color: "#909399"
  }
]);

// 通知公告
const notices = ref([
  {
    title: "系统维护通知",
    time: "2024-01-15",
    id: 1
  },
  {
    title: "新功能上线通知",
    time: "2024-01-14",
    id: 2
  },
  {
    title: "安全更新提醒",
    time: "2024-01-13",
    id: 3
  }
]);

// 系统信息
const systemInfo = ref({
  version: {
    label: "系统版本",
    value: "v1.2.0"
  },
  environment: {
    label: "运行环境",
    value: "开发环境"
  },
  uptime: {
    label: "运行时间",
    value: "72小时"
  },
  memory: {
    label: "内存使用",
    value: "68%"
  }
});

// 方法
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "早上好，";
  if (hour < 18) return "下午好，";
  return "晚上好，";
};

const getCurrentDate = () => {
  const today = new Date();
  return today.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long"
  });
};

const handleQuickAction = (action: any) => {
  switch (action.action) {
    case "create-project":
      ElMessage.info("打开新建项目页面");
      break;
    case "system-settings":
      ElMessage.info("打开系统设置");
      break;
    case "data-report":
      ElMessage.info("打开数据报告");
      break;
    case "dashboard":
      ElMessage.info("打开数据面板");
      break;
    default:
      ElMessage.info(`执行操作: ${action.label}`);
  }
};

const handleNoticeClick = (notice: any) => {
  ElMessage.info(`查看通知: ${notice.title}`);
};

// 生命周期
onMounted(() => {
  // 初始化图表或其他操作
  console.log("首页已加载");
});
</script>

<style scoped lang="scss">
.home-container {
  padding: 20px;
  background: var(--el-bg-color-page);
  min-height: calc(100vh - 110px);

  .welcome-section {
    margin-bottom: 24px;

    .welcome-card {
      background: linear-gradient(
        135deg,
        var(--el-color-primary) 0%,
        var(--el-color-primary-light-3) 100%
      );
      border: none;
      color: white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

      :deep(.el-card__body) {
        padding: 32px;
      }

      .welcome-content {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .welcome-text {
          h2 {
            margin: 0 0 12px 0;
            font-size: 28px;
            font-weight: 600;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          p {
            margin: 0;
            opacity: 0.9;
            font-size: 16px;
            font-weight: 400;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          }
        }

        .welcome-avatar {
          :deep(.el-avatar) {
            border: 4px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
        }
      }
    }
  }

  .stats-section {
    margin-bottom: 24px;

    .stats-card {
      height: 120px;
      cursor: pointer;
      transition: all 0.3s;
      border: 1px solid var(--el-border-color-lighter);
      background: var(--el-bg-color);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
        border-color: var(--el-color-primary-light-7);
      }

      :deep(.el-card__body) {
        padding: 24px;
        height: 100%;
      }

      .stats-content {
        display: flex;
        align-items: center;
        height: 100%;

        .stats-icon {
          margin-right: 20px;
          padding: 12px;
          background: var(--el-color-primary-light-9);
          border-radius: 8px;
        }

        .stats-info {
          flex: 1;

          .stats-value {
            font-size: 32px;
            font-weight: 700;
            color: var(--el-text-color-primary);
            margin-bottom: 6px;
            line-height: 1;
          }

          .stats-label {
            font-size: 14px;
            color: var(--el-text-color-secondary);
            margin-bottom: 10px;
            font-weight: 500;
          }

          .stats-trend {
            display: flex;
            align-items: center;
            font-size: 13px;
            font-weight: 500;

            .el-icon {
              margin-right: 4px;
            }
          }
        }
      }
    }
  }

  .main-content {
    .chart-card,
    .activity-card,
    .quick-actions,
    .notice-card,
    .system-info {
      margin-bottom: 24px;

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }

    .chart-card {
      .chart-container {
        height: 300px;

        .mock-chart {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--el-color-info-light-9);
          border-radius: 8px;

          .chart-placeholder {
            text-align: center;
            color: var(--el-text-color-placeholder);

            p {
              margin: 12px 0 0 0;
              font-size: 14px;
            }
          }
        }
      }
    }

    .activity-card {
      .activity-item {
        .activity-title {
          font-weight: 500;
          color: var(--el-text-color-primary);
          margin-bottom: 4px;
        }

        .activity-desc {
          font-size: 13px;
          color: var(--el-text-color-secondary);
          line-height: 1.4;
        }
      }
    }

    .quick-actions {
      .actions-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;

        .action-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          background: var(--el-color-info-light-9);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            background: var(--el-color-primary-light-9);
            color: var(--el-color-primary);
            transform: translateY(-2px);
          }

          .el-icon {
            margin-bottom: 8px;
          }

          span {
            font-size: 13px;
            text-align: center;
          }
        }
      }
    }

    .notice-card {
      .notice-list {
        .notice-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          cursor: pointer;
          border-bottom: 1px solid var(--el-border-color-lighter);
          transition: all 0.3s;

          &:last-child {
            border-bottom: none;
          }

          &:hover {
            background: var(--el-color-primary-light-9);
            margin: 0 -16px;
            padding: 12px 16px;
            border-radius: 6px;
          }

          .notice-content {
            flex: 1;

            .notice-title {
              font-size: 14px;
              color: var(--el-text-color-primary);
              margin-bottom: 4px;
            }

            .notice-time {
              font-size: 12px;
              color: var(--el-text-color-placeholder);
            }
          }

          .notice-arrow {
            color: var(--el-text-color-placeholder);
            font-size: 12px;
          }
        }
      }
    }

    .system-info {
      .info-list {
        .info-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid var(--el-border-color-lighter);

          &:last-child {
            border-bottom: none;
          }

          .info-label {
            font-size: 14px;
            color: var(--el-text-color-secondary);
          }

          .info-value {
            font-size: 14px;
            color: var(--el-text-color-primary);
            font-weight: 500;
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .home-container {
    padding: 12px;

    .welcome-content {
      flex-direction: column;
      text-align: center;

      .welcome-text {
        margin-bottom: 16px;
      }
    }

    .actions-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 12px !important;

      .action-item {
        padding: 16px !important;
      }
    }
  }
}

@media (max-width: 576px) {
  .home-container {
    .stats-section {
      .el-col {
        margin-bottom: 12px;
      }
    }

    .actions-grid {
      grid-template-columns: 1fr !important;
    }
  }
}
</style>
