import axios from "axios";
import { ElMessage } from "element-plus";
import { isOAuth2Login } from "@/utils/env";

// 为了避免循环依赖，我们在这里直接访问localStorage
const getTokenFromStorage = () => {
  return localStorage.getItem("user-token") || "";
};

const clearAuthInfo = () => {
  localStorage.removeItem("user-token");
  localStorage.removeItem("user-refresh-token");
  localStorage.removeItem("user-info");
};

// 标记是否正在刷新token
let isRefreshing = false;
// 重试队列
let requests: Array<(token: string) => void> = [];

//创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000
});
//请求拦截器
request.interceptors.request.use(
  config => {
    // 获取token并添加到请求头
    const token = getTokenFromStorage();
    if (token) {
      if (isOAuth2Login()) {
        // OAuth2模式使用标准的Authorization Bearer格式
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // Mock模式使用简单的token字段
        config.headers.token = token;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
//响应拦截器
request.interceptors.response.use(
  response => {
    return response.data;
  },
  async error => {
    const { response } = error;

    if (response) {
      const { status } = response;

      // Token过期处理
      if (status === 401) {
        const token = getTokenFromStorage();

        if (token && !isRefreshing) {
          isRefreshing = true;

          try {
            // 如果是OAuth2模式且有refresh token，尝试刷新
            if (isOAuth2Login()) {
              const refreshToken = localStorage.getItem("user-refresh-token");
              if (refreshToken) {
                // 这里需要调用刷新token的接口
                // 由于避免循环依赖，我们使用原生axios调用
                const refreshResponse = await axios.post(
                  `${import.meta.env.VITE_APP_BASE_API}/oauth2/refresh`,
                  { refreshToken },
                  { timeout: 5000 }
                );

                if (refreshResponse.data.code === 200) {
                  const newToken = refreshResponse.data.data.accessToken;
                  const newRefreshToken =
                    refreshResponse.data.data.refreshToken;

                  // 更新token
                  localStorage.setItem("user-token", newToken);
                  if (newRefreshToken) {
                    localStorage.setItem("user-refresh-token", newRefreshToken);
                  }

                  // 重试所有等待的请求
                  requests.forEach(cb => cb(newToken));
                  requests = [];

                  // 重试当前请求
                  const originalRequest = error.config;
                  originalRequest.headers.Authorization = `Bearer ${newToken}`;

                  return request(originalRequest);
                } else {
                  throw new Error("刷新token失败");
                }
              } else {
                throw new Error("无refresh token");
              }
            } else {
              throw new Error("非OAuth2模式无法刷新token");
            }
          } catch (refreshError) {
            // 刷新失败，清除认证信息并跳转到登录页
            clearAuthInfo();
            ElMessage.error("登录已过期，请重新登录");

            // 跳转到登录页，这里使用window.location避免循环依赖
            const currentPath = window.location.pathname;
            if (currentPath !== "/login") {
              window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
            }

            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        } else if (isRefreshing) {
          // 如果正在刷新token，将请求加入队列
          return new Promise(resolve => {
            requests.push((token: string) => {
              const originalRequest = error.config;
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(request(originalRequest));
            });
          });
        } else {
          // 没有token或刷新失败，跳转到登录页
          clearAuthInfo();
          ElMessage.error("请先登录");

          const currentPath = window.location.pathname;
          if (currentPath !== "/login") {
            window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
          }
        }
      } else {
        // 其他错误处理
        let msg = "";
        switch (status) {
          case 403:
            msg = "无权访问";
            break;
          case 404:
            msg = "请求地址错误";
            break;
          case 500:
            msg = "服务器出现问题";
            break;
          default:
            msg = response.data?.message || "请求失败";
        }

        ElMessage({
          type: "error",
          message: msg
        });
      }
    } else {
      // 网络错误
      ElMessage({
        type: "error",
        message: "网络连接失败，请检查网络设置"
      });
    }

    return Promise.reject(error);
  }
);
export default request;
