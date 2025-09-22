/**
 * 项目配置管理
 */

// 应用配置接口
export interface AppConfig {
  // 应用信息
  name: string;
  version: string;
  description: string;

  // API配置
  api: {
    baseURL: string;
    timeout: number;
    retryCount: number;
  };

  // 认证配置
  auth: {
    tokenKey: string;
    refreshTokenKey: string;
    userInfoKey: string;
    tokenExpireTime: number; // 小时
  };

  // 布局配置
  layout: {
    sidebarWidth: number;
    sidebarCollapsedWidth: number;
    headerHeight: number;
    footerHeight: number;
  };

  // 缓存配置
  cache: {
    storagePrefix: string;
    defaultExpireTime: number; // 毫秒
  };

  // 分页配置
  pagination: {
    defaultPageSize: number;
    pageSizeOptions: number[];
  };
}

// 默认配置
const defaultConfig: AppConfig = {
  name: "KBPD Admin",
  version: "1.0.0",
  description: "知识库后台管理系统",

  api: {
    baseURL: import.meta.env.VITE_APP_BASE_API || "/api",
    timeout: 10000,
    retryCount: 3
  },

  auth: {
    tokenKey: "user-token",
    refreshTokenKey: "user-refresh-token",
    userInfoKey: "user-info",
    tokenExpireTime: 24 // 24小时
  },

  layout: {
    sidebarWidth: 210,
    sidebarCollapsedWidth: 64,
    headerHeight: 60,
    footerHeight: 40
  },

  cache: {
    storagePrefix: "kbpd_",
    defaultExpireTime: 24 * 60 * 60 * 1000 // 24小时
  },

  pagination: {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100]
  }
};

// 获取应用配置
export function getAppConfig(): AppConfig {
  return { ...defaultConfig };
}

// 获取特定配置项
export function getConfig<K extends keyof AppConfig>(key: K): AppConfig[K] {
  return getAppConfig()[key];
}

// 环境检查工具
export const ENV = {
  isDev: import.meta.env.NODE_ENV === "development",
  isProd: import.meta.env.NODE_ENV === "production",
  isTest: import.meta.env.NODE_ENV === "test",

  // 登录模式
  isMockLogin: import.meta.env.VITE_LOGIN_MODE === "mock",
  isOAuth2Login: import.meta.env.VITE_LOGIN_MODE === "oauth2",

  // 调试模式
  enableMock: import.meta.env.VITE_ENABLE_MOCK === "true",
  enableDevtools: import.meta.env.NODE_ENV === "development"
};

// 常量定义
export const CONSTANTS = {
  // HTTP状态码
  HTTP_STATUS: {
    OK: 200,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  },

  // 响应码
  RESPONSE_CODE: {
    SUCCESS: 200,
    ERROR: 500,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403
  },

  // 本地存储键名
  STORAGE_KEYS: {
    TOKEN: "user-token",
    REFRESH_TOKEN: "user-refresh-token",
    USER_INFO: "user-info",
    LAYOUT_CONFIG: "layout-config",
    THEME_CONFIG: "theme-config"
  },

  // 默认头像
  DEFAULT_AVATAR:
    "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif"
};
