<template>
  <el-popover
    v-model:visible="visible"
    placement="bottom-end"
    width="320px"
    :show-arrow="false"
    class="notice-popover"
  >
    <template #reference>
      <div ref="triggerRef"></div>
    </template>

    <div class="notice-content">
      <div class="notice-header">
        <div class="header-title">
          <el-icon><Bell /></el-icon>
          <span>消息通知</span>
          <el-badge :value="unreadCount" :hidden="unreadCount === 0" />
        </div>
        <div class="header-actions">
          <el-button text size="small" @click="markAllAsRead">
            全部已读
          </el-button>
        </div>
      </div>

      <el-tabs v-model="activeTab" class="notice-tabs">
        <el-tab-pane label="通知" name="notice" :lazy="false">
          <div class="notice-list">
            <div
              v-for="item in noticeList"
              :key="item.id"
              class="notice-item"
              :class="{ unread: !item.read }"
              @click="handleNoticeClick(item)"
            >
              <div class="notice-avatar">
                <el-avatar :size="32" :src="item.avatar">
                  <el-icon><Bell /></el-icon>
                </el-avatar>
              </div>
              <div class="notice-content">
                <div class="notice-title">{{ item.title }}</div>
                <div class="notice-desc">{{ item.description }}</div>
                <div class="notice-time">{{ formatTime(item.time) }}</div>
              </div>
              <div v-if="!item.read" class="unread-dot"></div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="消息" name="message" :lazy="false">
          <div class="notice-list">
            <div
              v-for="item in messageList"
              :key="item.id"
              class="notice-item"
              :class="{ unread: !item.read }"
              @click="handleMessageClick(item)"
            >
              <div class="notice-avatar">
                <el-avatar :size="32" :src="item.avatar">
                  <el-icon><User /></el-icon>
                </el-avatar>
              </div>
              <div class="notice-content">
                <div class="notice-title">{{ item.title }}</div>
                <div class="notice-desc">{{ item.description }}</div>
                <div class="notice-time">{{ formatTime(item.time) }}</div>
              </div>
              <div v-if="!item.read" class="unread-dot"></div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="待办" name="todo" :lazy="false">
          <div class="notice-list">
            <div
              v-for="item in todoList"
              :key="item.id"
              class="notice-item"
              :class="{ unread: !item.read }"
              @click="handleTodoClick(item)"
            >
              <div class="notice-avatar">
                <el-avatar :size="32">
                  <el-icon><Document /></el-icon>
                </el-avatar>
              </div>
              <div class="notice-content">
                <div class="notice-title">{{ item.title }}</div>
                <div class="notice-desc">{{ item.description }}</div>
                <div class="notice-time">{{ formatTime(item.time) }}</div>
              </div>
              <div v-if="!item.read" class="unread-dot"></div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div class="notice-footer">
        <el-button text type="primary" @click="viewAll"> 查看全部 </el-button>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Bell, User, Document } from "@element-plus/icons-vue";

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 触发器引用
const triggerRef = ref();

// 当前选项卡
const activeTab = ref("notice");

// 弹窗显示状态
const visible = computed({
  get: () => props.modelValue,
  set: value => emit("update:modelValue", value)
});

// 模拟通知数据
const noticeList = ref([
  {
    id: 1,
    title: "系统更新通知",
    description: "系统将于今晚12:00进行更新维护",
    time: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    avatar: ""
  },
  {
    id: 2,
    title: "新功能发布",
    description: "新增了数据导出功能，欢迎体验",
    time: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
    avatar: ""
  }
]);

const messageList = ref([
  {
    id: 1,
    title: "张三",
    description: "发送了一条消息给你",
    time: new Date(Date.now() - 1000 * 60 * 15),
    read: false,
    avatar: ""
  },
  {
    id: 2,
    title: "李四",
    description: "回复了你的评论",
    time: new Date(Date.now() - 1000 * 60 * 60),
    read: true,
    avatar: ""
  }
]);

const todoList = ref([
  {
    id: 1,
    title: "审核用户申请",
    description: "有3个用户申请待审核",
    time: new Date(Date.now() - 1000 * 60 * 10),
    read: false,
    avatar: ""
  },
  {
    id: 2,
    title: "完成月度报告",
    description: "月度报告截止时间：明天",
    time: new Date(Date.now() - 1000 * 60 * 60 * 6),
    read: false,
    avatar: ""
  }
]);

// 计算未读数量
const unreadCount = computed(() => {
  const noticeUnread = noticeList.value.filter(item => !item.read).length;
  const messageUnread = messageList.value.filter(item => !item.read).length;
  const todoUnread = todoList.value.filter(item => !item.read).length;
  return noticeUnread + messageUnread + todoUnread;
});

// 格式化时间
const formatTime = (time: Date) => {
  const now = new Date();
  const diff = now.getTime() - time.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;

  return time.toLocaleDateString();
};

// 标记全部已读
const markAllAsRead = () => {
  noticeList.value.forEach(item => (item.read = true));
  messageList.value.forEach(item => (item.read = true));
  todoList.value.forEach(item => (item.read = true));
};

// 处理通知点击
const handleNoticeClick = (item: any) => {
  item.read = true;
  console.log("点击通知:", item);
};

// 处理消息点击
const handleMessageClick = (item: any) => {
  item.read = true;
  console.log("点击消息:", item);
};

// 处理待办点击
const handleTodoClick = (item: any) => {
  item.read = true;
  console.log("点击待办:", item);
};

// 查看全部
const viewAll = () => {
  visible.value = false;
  console.log("查看全部通知");
};
</script>

<style lang="scss" scoped>
.notice-popover {
  :deep(.el-popover) {
    padding: 0;
  }
}

.notice-content {
  .notice-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid var(--el-border-color-light);

    .header-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 500;
      color: var(--el-text-color-primary);
    }
  }

  .notice-tabs {
    :deep(.el-tabs__header) {
      margin: 0;
      padding: 0 16px;
      border-bottom: 1px solid var(--el-border-color-light);
    }

    :deep(.el-tabs__content) {
      padding: 0;
    }
  }

  .notice-list {
    max-height: 300px;
    overflow-y: auto;

    .notice-item {
      display: flex;
      align-items: flex-start;
      padding: 12px 16px;
      cursor: pointer;
      position: relative;
      transition: background-color 0.3s;

      &:hover {
        background-color: var(--el-color-primary-light-9);
      }

      &.unread {
        background-color: var(--el-color-info-light-9);
      }

      .notice-avatar {
        margin-right: 12px;
      }

      .notice-content {
        flex: 1;
        min-width: 0;

        .notice-title {
          font-size: 14px;
          color: var(--el-text-color-primary);
          font-weight: 500;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .notice-desc {
          font-size: 12px;
          color: var(--el-text-color-secondary);
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .notice-time {
          font-size: 12px;
          color: var(--el-text-color-placeholder);
        }
      }

      .unread-dot {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 8px;
        height: 8px;
        background-color: var(--el-color-danger);
        border-radius: 50%;
      }
    }
  }

  .notice-footer {
    padding: 12px 16px;
    border-top: 1px solid var(--el-border-color-light);
    text-align: center;
  }
}
</style>
