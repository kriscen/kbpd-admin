<template>
  <div class="redirect-container">
    <el-loading text="页面跳转中..." background="rgba(0, 0, 0, 0.1)" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

onMounted(() => {
  const { params, query } = route;
  const { path } = params;

  // 重定向到目标路径
  router.replace({
    path: "/" + (Array.isArray(path) ? path.join("/") : path),
    query
  });
});
</script>

<style lang="scss" scoped>
.redirect-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
