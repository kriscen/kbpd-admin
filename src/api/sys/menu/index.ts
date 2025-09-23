/**
 * 菜单相关API接口
 */

import request from "@/utils/request";
import type { ApiResponse } from "@/api/sys/user/type";
import type { MenuInfo } from "@/api/sys/menu/type";

/**
 * 获取用户菜单列表
 */
export function reqMenuList(): Promise<ApiResponse<MenuInfo[]>> {
  return request({
    url: "/menu/list",
    method: "get"
  });
}

/**
 * OAuth2模式下获取菜单列表 (需要传递用户角色信息)
 */
export function reqOAuth2MenuList(
  roles: string[]
): Promise<ApiResponse<MenuInfo[]>> {
  return request({
    url: "/oauth2/menu/list",
    method: "post",
    data: { roles }
  });
}
