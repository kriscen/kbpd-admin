<template>
  <div class="debug-container">
    <h2>API调试工具</h2>

    <el-card style="margin-bottom: 20px">
      <template #header>
        <span>环境信息</span>
      </template>
      <div>
        <p><strong>登录模式:</strong> {{ envInfo.loginMode }}</p>
        <p><strong>API基础地址:</strong> {{ envInfo.baseAPI }}</p>
        <p><strong>启用Mock:</strong> {{ envInfo.enableMock ? "是" : "否" }}</p>
        <p><strong>当前Token:</strong> {{ currentToken || "无" }}</p>
        <p><strong>用户信息:</strong> {{ userInfo ? "已加载" : "未加载" }}</p>
      </div>
    </el-card>

    <el-card style="margin-bottom: 20px">
      <template #header>
        <span>API测试</span>
      </template>
      <div class="api-test">
        <el-button @click="testUserInfo" type="primary"
          >测试获取用户信息</el-button
        >
        <el-button @click="testMenuList" type="success"
          >测试获取菜单列表</el-button
        >
        <el-button @click="testDirectMenuAPI" type="warning"
          >直接测试菜单API</el-button
        >
        <el-button @click="testMenuStore" type="info">测试菜单Store</el-button>
        <el-button @click="testLogout" type="warning">测试退出登录</el-button>
        <el-button @click="clearStorage" type="danger">清理存储</el-button>
      </div>
    </el-card>

    <el-card v-if="testResults.length > 0">
      <template #header>
        <span>测试结果</span>
      </template>
      <div class="test-results">
        <div
          v-for="(result, index) in testResults"
          :key="index"
          class="result-item"
          :class="result.success ? 'success' : 'error'"
        >
          <div class="result-header">
            <strong>{{ result.api }}</strong>
            <span class="timestamp">{{ result.timestamp }}</span>
          </div>
          <div class="result-content">
            <pre>{{ JSON.stringify(result.data, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { reqUserInfo } from "@/api/sys/user";
import { reqMenuList } from "@/api/sys/menu";
import { useUserStore } from "@/store/user";
import { useMenuStore } from "@/store/menu";
import { getEnvConfig } from "@/utils/env";
import { ElMessage } from "element-plus";

const envInfo = ref<any>(getEnvConfig());
const currentToken = ref("");
const userInfo = ref<any>(null);
const testResults = ref<any[]>([]);

const router = useRouter();
const userStore = useUserStore();
const menuStore = useMenuStore();

const addTestResult = (api: string, success: boolean, data: any) => {
  testResults.value.unshift({
    api,
    success,
    data,
    timestamp: new Date().toLocaleString()
  });

  // 最多保留10条记录
  if (testResults.value.length > 10) {
    testResults.value.pop();
  }
};

const testUserInfo = async () => {
  try {
    console.log("开始测试用户信息API...");
    console.log("当前Token:", localStorage.getItem("user-token"));
    console.log("当前登录模式:", envInfo.value.loginMode);

    const result = await reqUserInfo();
    console.log("用户信息API结果:", result);

    if (result.code === 200) {
      userInfo.value = result.data.checkUser;
      ElMessage.success("获取用户信息成功");
      addTestResult("GET /api/user/info", true, result);
    } else {
      ElMessage.error("获取用户信息失败: " + (result.message || "未知错误"));
      addTestResult("GET /api/user/info", false, result);
    }
  } catch (error) {
    console.error("用户信息API错误:", error);
    ElMessage.error("用户信息API调用失败");
    addTestResult("GET /api/user/info", false, {
      error: (error as Error).message || String(error)
    });
  }
};

const testDirectMenuAPI = async () => {
  try {
    console.log("开始直接测试菜单API...");

    // 直接使用fetch调用菜单API
    const token = localStorage.getItem("user-token") || "Admin Token";
    console.log("使用token:", token);

    const response = await fetch("/api/menu/list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: token // 使用mock模式的token字段
      }
    });

    console.log("菜单API响应状态:", response.status);
    console.log("菜单API响应头:", [...response.headers.entries()]);

    const result = await response.text();
    console.log("菜单API响应内容:", result);

    // 尝试解析为JSON
    try {
      const jsonResult = JSON.parse(result);
      console.log("解析后的JSON:", jsonResult);
      ElMessage.success("直接菜单API调用成功");
      addTestResult("直接菜单API", true, jsonResult);
    } catch (parseError) {
      console.error("JSON解析失败:", parseError);
      ElMessage.error("菜单API返回HTML而不是JSON");
      addTestResult("直接菜单API", false, {
        error: "JSON解析失败",
        response: result.substring(0, 200) + "..."
      });
    }
  } catch (error) {
    console.error("直接菜单API错误:", error);
    ElMessage.error("直接菜单API调用失败");
    addTestResult("直接菜单API", false, {
      error: (error as Error).message || String(error)
    });
  }
};

const testMenuList = async () => {
  try {
    console.log("开始测试菜单列表API...");

    // 检查当前的token和用户信息
    const token = localStorage.getItem("user-token");
    const userInfo = localStorage.getItem("user-info");

    console.log("当前Token:", token);
    console.log("当前用户信息:", userInfo);
    console.log("当前登录模式:", envInfo.value.loginMode);

    if (!token) {
      const error = "未找到token，请先登录";
      ElMessage.error(error);
      addTestResult("GET /api/menu/list", false, { error });
      return;
    }

    // 使用我们的API封装调用
    console.log("开始调用reqMenuList...");
    const result = await reqMenuList();
    console.log("菜单列表API结果类型:", typeof result);
    console.log("菜单列表API结果:", result);

    // 检查结果类型
    if (typeof result === "string") {
      console.error(
        "reqMenuList返回了字符串而不是对象:",
        (result as string).substring(0, 200)
      );
      ElMessage.error("菜单API返回HTML而不是JSON");
      addTestResult("GET /api/menu/list", false, {
        error: "API返回了HTML",
        response: (result as string).substring(0, 200) + "..."
      });
      return;
    }

    if (result && (result as any).code === 200) {
      ElMessage.success("获取菜单列表成功");
      addTestResult("GET /api/menu/list", true, result);
    } else {
      const errorMsg =
        (result as any)?.data?.message ||
        (result as any)?.message ||
        `API返回错误码: ${(result as any)?.code || "undefined"}`;
      ElMessage.error("获取菜单列表失败: " + errorMsg);
      addTestResult("GET /api/menu/list", false, result);
    }
  } catch (error) {
    console.error("菜单列表API错误:", error);
    ElMessage.error("菜单列表API调用失败");
    addTestResult("GET /api/menu/list", false, {
      error: (error as Error).message || String(error)
    });
  }
};

const testMenuStore = async () => {
  try {
    console.log("开始测试菜单Store...");

    // 检查当前状态
    console.log("菜单是否已加载:", menuStore.isMenuLoaded);
    console.log("当前菜单数据:", menuStore.menuList);

    // 调用Store的fetchMenuList方法
    const result = await menuStore.fetchMenuList();
    console.log("MenuStore.fetchMenuList结果:", result);

    if (result.success) {
      ElMessage.success("菜单Store加载成功");
      addTestResult("菜单Store.fetchMenuList", true, {
        menuCount: menuStore.menuList.length,
        isLoaded: menuStore.isMenuLoaded,
        menus: menuStore.menuList
      });
    } else {
      ElMessage.error("MenuStore加载失败: " + result.message);
      addTestResult("菜单Store.fetchMenuList", false, result);
    }
  } catch (error) {
    console.error("MenuStore测试错误:", error);
    ElMessage.error("MenuStore测试失败");
    addTestResult("菜单Store.fetchMenuList", false, {
      error: (error as Error).message || String(error)
    });
  }
};

const testLogout = () => {
  try {
    // 测试用户Store的logout方法
    const userStore = useUserStore();
    userStore.logout();

    // 跳转到登录页
    router.push("/login");

    ElMessage.success("退出登录成功");
    addTestResult("退出登录", true, { message: "退出成功" });
  } catch (error) {
    console.error("退出登录错误:", error);
    ElMessage.error("退出登录失败");
    addTestResult("退出登录", false, {
      error: (error as Error).message || String(error)
    });
  }
};

const clearStorage = () => {
  localStorage.clear();
  currentToken.value = "";
  userInfo.value = null;
  ElMessage.info("本地存储已清理");
};

const loadStorageInfo = () => {
  currentToken.value = localStorage.getItem("user-token") || "";
  try {
    const storedUserInfo = localStorage.getItem("user-info");
    userInfo.value = storedUserInfo ? JSON.parse(storedUserInfo) : null;
  } catch {
    userInfo.value = null;
  }

  // 添加环境变量信息
  envInfo.value = {
    ...getEnvConfig(),
    enableMock: import.meta.env.VITE_ENABLE_MOCK === "true"
  };
};

onMounted(() => {
  loadStorageInfo();
  console.log("调试页面已加载，环境信息:", envInfo.value);
});
</script>

<style lang="scss" scoped>
.debug-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.api-test {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.test-results {
  max-height: 400px;
  overflow-y: auto;
}

.result-item {
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #ddd;

  &.success {
    border-color: #67c23a;
    background-color: #f0f9ff;
  }

  &.error {
    border-color: #f56c6c;
    background-color: #fef2f2;
  }
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  .timestamp {
    font-size: 12px;
    color: #666;
  }
}

.result-content {
  pre {
    background: #f5f5f5;
    padding: 10px;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 12px;
    line-height: 1.4;
    margin: 0;
  }
}
</style>
