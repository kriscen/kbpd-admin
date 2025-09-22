/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_BASE_API: string;
  readonly VITE_LOGIN_MODE: "mock" | "oauth2";
  readonly VITE_OAUTH2_AUTH_URL: string;
  readonly VITE_OAUTH2_TOKEN_URL: string;
  readonly VITE_OAUTH2_CLIENT_ID: string;
  readonly VITE_OAUTH2_REDIRECT_URI: string;
  readonly VITE_OAUTH2_SCOPE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// 扩展 vue-router 的 meta 字段
declare module "vue-router" {
  interface RouteMeta {
    title?: string;
    requiresAuth?: boolean;
  }
}
