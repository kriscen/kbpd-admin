<template>
  <div class="frame-container">
    <iframe
      :src="frameSrc"
      frameborder="0"
      class="frame-content"
      @load="handleLoad"
    />
    <div v-if="loading" class="frame-loading">
      <el-loading text="页面加载中..." />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

// 状态
const loading = ref(true);

// 计算 iframe 源地址
const frameSrc = computed(() => {
  return (route.query.src as string) || "";
});

// 加载完成处理
const handleLoad = () => {
  loading.value = false;
};

// 组件挂载
onMounted(() => {
  if (!frameSrc.value) {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
.frame-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .frame-content {
    width: 100%;
    height: 100%;
    border: none;
  }

  .frame-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--el-bg-color);
  }
}
</style>
