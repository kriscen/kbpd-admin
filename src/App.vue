<template>
  <h1>app</h1>
  <el-button type="primary">Primary</el-button>
  <svg-icon name="phone" />
</template>

<script setup lang="ts">
import axios from "axios";

axios
  .post("/api/user/login", {
    username: "admin",
    password: "111111"
  })
  .then(res => {
    console.log(res.data);
  });
</script>

<style scoped lang="scss"></style>
