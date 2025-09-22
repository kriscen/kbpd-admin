import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { LoginState } from "@/api/sys/user/type";
import {
  reqLogin,
  reqUserInfo,
  reqOAuth2Login,
  reqOAuth2RefreshToken
} from "@/api/sys/user";
import type {
  loginReq,
  OAuth2LoginReq,
  OAuth2RefreshReq
} from "@/api/sys/user/type";
import { isMockLogin, isOAuth2Login } from "@/utils/env";
import { ElMessage } from "element-plus";

export const useUserStore = defineStore("user", () => {
  // 状态定义
  const token = ref<string>("");
  const refreshToken = ref<string>("");
  const userInfo = ref<any>(null);
  const isLoggedIn = ref<boolean>(false);
  const loginMode = ref<"mock" | "oauth2">(isMockLogin() ? "mock" : "oauth2");

  // 计算属性
  const getUserInfo = computed(() => userInfo.value);
  const getToken = computed(() => token.value);
  const getIsLoggedIn = computed(() => isLoggedIn.value);

  // 从localStorage获取token
  const getTokenFromStorage = () => {
    const stored = localStorage.getItem("user-token");
    if (stored) {
      token.value = stored;
      isLoggedIn.value = true;
    }
  };

  // 从localStorage获取refreshToken
  const getRefreshTokenFromStorage = () => {
    const stored = localStorage.getItem("user-refresh-token");
    if (stored) {
      refreshToken.value = stored;
    }
  };

  // 保存token到localStorage
  const setTokenToStorage = (tokenValue: string) => {
    token.value = tokenValue;
    localStorage.setItem("user-token", tokenValue);
    isLoggedIn.value = true;
  };

  // 保存refreshToken到localStorage
  const setRefreshTokenToStorage = (refreshTokenValue: string) => {
    refreshToken.value = refreshTokenValue;
    localStorage.setItem("user-refresh-token", refreshTokenValue);
  };

  // 清除所有认证信息
  const clearAuthInfo = () => {
    token.value = "";
    refreshToken.value = "";
    userInfo.value = null;
    isLoggedIn.value = false;
    localStorage.removeItem("user-token");
    localStorage.removeItem("user-refresh-token");
    localStorage.removeItem("user-info");
  };

  // 传统用户名密码登录
  const login = async (loginData: loginReq) => {
    try {
      const result = await reqLogin(loginData);
      if (result.code === 200) {
        setTokenToStorage(result.data.token);
        ElMessage.success("登录成功");
        return { success: true };
      } else {
        ElMessage.error(result.message || "登录失败");
        return { success: false, message: result.message };
      }
    } catch (error) {
      ElMessage.error("登录失败，请检查网络连接");
      return { success: false, message: "网络错误" };
    }
  };

  // OAuth2登录
  const oAuth2Login = async (oAuth2Data: OAuth2LoginReq) => {
    try {
      const result = await reqOAuth2Login(oAuth2Data);
      if (result.code === 200) {
        setTokenToStorage(result.data.accessToken);
        if (result.data.refreshToken) {
          setRefreshTokenToStorage(result.data.refreshToken);
        }
        ElMessage.success("登录成功");
        return { success: true };
      } else {
        ElMessage.error(result.message || "OAuth2登录失败");
        return { success: false, message: result.message };
      }
    } catch (error) {
      ElMessage.error("OAuth2登录失败，请检查网络连接");
      return { success: false, message: "网络错误" };
    }
  };

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      const result = await reqUserInfo();
      if (result.code === 200) {
        userInfo.value = result.data.checkUser;
        localStorage.setItem(
          "user-info",
          JSON.stringify(result.data.checkUser)
        );
        return { success: true, data: result.data.checkUser };
      } else {
        ElMessage.error(result.message || "获取用户信息失败");
        return { success: false, message: result.message };
      }
    } catch (error) {
      ElMessage.error("获取用户信息失败");
      return { success: false, message: "网络错误" };
    }
  };

  // 刷新token（仅OAuth2模式）
  const refreshAccessToken = async () => {
    if (!refreshToken.value || !isOAuth2Login()) {
      return { success: false, message: "无refresh token或非OAuth2模式" };
    }

    try {
      const result = await reqOAuth2RefreshToken({
        refreshToken: refreshToken.value
      });
      if (result.code === 200) {
        setTokenToStorage(result.data.accessToken);
        if (result.data.refreshToken) {
          setRefreshTokenToStorage(result.data.refreshToken);
        }
        return { success: true };
      } else {
        // refresh token也过期了，需要重新登录
        clearAuthInfo();
        return { success: false, message: "refresh token过期，需要重新登录" };
      }
    } catch (error) {
      clearAuthInfo();
      return { success: false, message: "刷新token失败" };
    }
  };

  // 登出
  const logout = () => {
    clearAuthInfo();
    ElMessage.success("退出登录成功");
  };

  // 初始化用户状态（从localStorage恢复）
  const initUserState = () => {
    getTokenFromStorage();
    getRefreshTokenFromStorage();

    const storedUserInfo = localStorage.getItem("user-info");
    if (storedUserInfo) {
      try {
        userInfo.value = JSON.parse(storedUserInfo);
      } catch (error) {
        console.error("解析用户信息失败:", error);
        localStorage.removeItem("user-info");
      }
    }
  };

  // 检查登录状态
  const checkLoginStatus = () => {
    return isLoggedIn.value && token.value;
  };

  return {
    // 状态
    token: getToken,
    refreshToken,
    userInfo: getUserInfo,
    isLoggedIn: getIsLoggedIn,
    loginMode,

    // 方法
    login,
    oAuth2Login,
    logout,
    fetchUserInfo,
    refreshAccessToken,
    initUserState,
    checkLoginStatus,
    clearAuthInfo
  };
});
