/**
 * 菜单API相关类型定义
 */

// 菜单元信息
export interface MenuMeta {
  title: string;
  icon?: string;
  hidden?: boolean;
  keepAlive?: boolean;
  affix?: boolean;
  roles?: string[];
  activeMenu?: string;
  permission?: string;
}

// 菜单信息
export interface MenuInfo {
  id: string;
  parentId?: string;
  path: string;
  name: string;
  component?: string;
  redirect?: string;
  meta: MenuMeta;
  children?: MenuInfo[];
}

// 获取菜单列表请求参数
export interface MenuListReq {
  roles?: string[];
  userId?: number;
}

// 获取菜单列表响应
export interface MenuListResp {
  code: number;
  data: MenuInfo[];
  message?: string;
}

// OAuth2菜单请求参数
export interface OAuth2MenuReq {
  roles: string[];
  permissions?: string[];
}
