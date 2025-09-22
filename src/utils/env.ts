/**
 * 环境配置工具类
 * 用于获取环境变量和判断当前登录模式
 */

export const getEnvConfig = () => {
  return {
    // 当前环境
    env: import.meta.env.NODE_ENV,

    // API基础地址
    baseAPI: import.meta.env.VITE_APP_BASE_API,

    // 登录模式
    loginMode: import.meta.env.VITE_LOGIN_MODE || "mock",

    // OAuth2配置
    oauth2: {
      authUrl: import.meta.env.VITE_OAUTH2_AUTH_URL,
      tokenUrl: import.meta.env.VITE_OAUTH2_TOKEN_URL,
      clientId: import.meta.env.VITE_OAUTH2_CLIENT_ID,
      redirectUri: import.meta.env.VITE_OAUTH2_REDIRECT_URI,
      scope: import.meta.env.VITE_OAUTH2_SCOPE
    }
  };
};

/**
 * 判断是否为开发环境
 */
export const isDev = () => {
  return import.meta.env.NODE_ENV === "development";
};

/**
 * 判断是否为生产环境
 */
export const isProd = () => {
  return import.meta.env.NODE_ENV === "production";
};

/**
 * 判断是否使用模拟数据登录
 */
export const isMockLogin = () => {
  return import.meta.env.VITE_LOGIN_MODE === "mock";
};

/**
 * 判断是否使用OAuth2登录
 */
export const isOAuth2Login = () => {
  return import.meta.env.VITE_LOGIN_MODE === "oauth2";
};

/**
 * 获取完整的OAuth2授权URL
 */
export const getOAuth2AuthUrl = () => {
  const config = getEnvConfig();
  const params = new URLSearchParams({
    client_id: config.oauth2.clientId,
    redirect_uri: config.oauth2.redirectUri,
    response_type: "code",
    scope: config.oauth2.scope,
    state: generateState() // 防止CSRF攻击
  });

  return `${config.oauth2.authUrl}?${params.toString()}`;
};

/**
 * 生成随机state参数用于防止CSRF攻击
 */
export const generateState = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};
