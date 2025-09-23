// types/virtual.d.ts
declare module "virtual:svg-icons-register" {
  const content: string;
  export default content;
}

// 为 Vue 文件添加类型声明
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
