<!-- 布局使用示例 -->
<template>
  <div id="app">
    <!-- 使用布局系统 -->
    <Layout />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import Layout from "./index.vue";

// 引入布局样式
import "./styles/index.scss";

// 在应用启动时初始化布局配置
onMounted(() => {
  console.log("布局系统已加载");
});
</script>

<style>
/* 全局样式可以在这里定义 */
#app {
  height: 100vh;
  overflow: hidden;
}
</style>
