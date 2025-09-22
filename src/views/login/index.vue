<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>{{ isMock ? "系统登录" : "OAuth2登录" }}</h2>
        <p class="login-subtitle">
          {{ isMock ? "使用账号密码登录" : "使用OAuth2认证中心登录" }}
        </p>
      </div>

      <!-- 模拟数据登录表单 -->
      <el-form
        v-if="isMock"
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            size="large"
            prefix-icon="User"
            clearable
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            prefix-icon="Lock"
            show-password
            clearable
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-btn"
            :loading="loading"
            @click="handleLogin"
          >
            {{ loading ? "登录中..." : "登录" }}
          </el-button>
        </el-form-item>

        <div class="demo-account">
          <p>演示账号：</p>
          <p>管理员：username: admin, password: 111111</p>
          <p>系统管理员：username: system, password: 111111</p>
        </div>
      </el-form>

      <!-- OAuth2登录按钮 -->
      <div v-else class="oauth2-login">
        <el-button
          type="primary"
          size="large"
          class="oauth2-btn"
          :loading="loading"
          @click="handleOAuth2Login"
        >
          {{ loading ? "跳转中..." : "使用OAuth2登录" }}
        </el-button>

        <div class="oauth2-info">
          <p>点击后将跳转到OAuth2认证中心</p>
          <p>认证成功后自动返回系统</p>
        </div>
      </div>

      <!-- 模式切换提示 -->
      <div class="mode-info">
        <p>
          当前模式：{{ isMock ? "开发模式(模拟数据)" : "生产模式(OAuth2认证)" }}
        </p>
        <p class="mode-tip">可在.env文件中修改VITE_LOGIN_MODE参数进行切换</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import { useUserStore } from "@/store/user";
import { isMockLogin, getOAuth2AuthUrl } from "@/utils/env";
import type { loginReq, OAuth2LoginReq } from "@/api/sys/user/type";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// 判断是否为模拟数据模式
const isMock = ref(isMockLogin());
const loading = ref(false);
const loginFormRef = ref<FormInstance>();

// 登录表单数据
const loginForm = reactive<loginReq>({
  username: "",
  password: ""
});

// 表单校验规则
const loginRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 2, max: 20, message: "用户名长度在2-20个字符", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度在6-20个字符", trigger: "blur" }
  ]
};

// 传统登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) return;

  try {
    await loginFormRef.value.validate();
    loading.value = true;

    const result = await userStore.login(loginForm);
    if (result.success) {
      // 登录成功后获取用户信息
      await userStore.fetchUserInfo();

      // 跳转到主页或原来想访问的页面
      const redirect = route.query.redirect as string;
      await router.push(redirect || "/home");
    }
  } catch (error) {
    console.error("登录失败:", error);
  } finally {
    loading.value = false;
  }
};

// OAuth2登录处理
const handleOAuth2Login = () => {
  loading.value = true;

  try {
    // 获取OAuth2授权URL并跳转
    const authUrl = getOAuth2AuthUrl();

    // 保存当前要跳转的页面，以便登录成功后跳转
    const redirect = route.query.redirect as string;
    if (redirect) {
      sessionStorage.setItem("oauth2-redirect", redirect);
    }

    // 跳转到OAuth2认证页面
    window.location.href = authUrl;
  } catch (error) {
    ElMessage.error("获取OAuth2授权地址失败");
    loading.value = false;
  }
};

// 处理OAuth2回调
const handleOAuth2Callback = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");
  const error = urlParams.get("error");

  if (error) {
    ElMessage.error(`OAuth2认证失败: ${error}`);
    return;
  }

  if (code && state) {
    loading.value = true;

    try {
      const oAuth2Data: OAuth2LoginReq = { code, state };
      const result = await userStore.oAuth2Login(oAuth2Data);

      if (result.success) {
        // 登录成功后获取用户信息
        await userStore.fetchUserInfo();

        // 跳转到主页或原来想访问的页面
        const redirect = sessionStorage.getItem("oauth2-redirect") || "/home";
        sessionStorage.removeItem("oauth2-redirect");
        await router.push(redirect);
      }
    } catch (error) {
      console.error("OAuth2登录失败:", error);
    } finally {
      loading.value = false;
    }
  }
};

// 组件挂载时检查是否为OAuth2回调
onMounted(() => {
  // 检查是否为OAuth2回调
  if (route.query.code) {
    handleOAuth2Callback();
  }

  // 初始化用户状态
  userStore.initUserState();

  // 如果已经登录，直接跳转到主页
  if (userStore.checkLoginStatus()) {
    const redirect = route.query.redirect as string;
    router.push(redirect || "/home");
  }
});
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-box {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;

  .login-header {
    text-align: center;
    margin-bottom: 40px;

    h2 {
      color: #333;
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .login-subtitle {
      color: #666;
      font-size: 14px;
      margin: 0;
    }
  }

  .login-form {
    .el-form-item {
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .login-btn {
      width: 100%;
      height: 48px;
      font-size: 16px;
      font-weight: 500;
      border-radius: 8px;
    }

    .demo-account {
      margin-top: 24px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      font-size: 13px;
      color: #666;

      p {
        margin: 4px 0;

        &:first-child {
          font-weight: 500;
          color: #333;
        }
      }
    }
  }

  .oauth2-login {
    text-align: center;

    .oauth2-btn {
      width: 100%;
      height: 48px;
      font-size: 16px;
      font-weight: 500;
      border-radius: 8px;
      margin-bottom: 24px;
    }

    .oauth2-info {
      padding: 16px;
      background: #f0f9ff;
      border-radius: 8px;
      font-size: 13px;
      color: #0369a1;

      p {
        margin: 4px 0;
      }
    }
  }

  .mode-info {
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid #e5e7eb;
    text-align: center;
    font-size: 12px;
    color: #9ca3af;

    p {
      margin: 4px 0;

      &:first-child {
        color: #4b5563;
        font-weight: 500;
      }
    }

    .mode-tip {
      font-style: italic;
    }
  }
}

// 响应式设计
@media (max-width: 640px) {
  .login-container {
    padding: 16px;
  }

  .login-box {
    padding: 24px;

    .login-header {
      margin-bottom: 32px;

      h2 {
        font-size: 24px;
      }
    }
  }
}
</style>
