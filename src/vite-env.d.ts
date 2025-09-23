/// <reference types="vite/client" />

// 为 Vue 文件添加类型声明
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

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
