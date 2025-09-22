/**
 * 路由权限控制工具
 */

// 白名单路由（不需要认证的路由）
export const WHITE_LIST = ["/login", "/auth/callback", "/404"];

// 需要权限的路由映射
export const PERMISSION_ROUTES: Record<string, string[]> = {
  "/system": ["系统管理员", "平台管理员"],
  "/user": ["平台管理员"],
  "/dashboard": ["系统管理员", "平台管理员"]
};

/**
 * 检查路由是否在白名单中
 */
export function isWhiteList(path: string): boolean {
  return WHITE_LIST.includes(path);
}

/**
 * 检查用户是否有访问路由的权限
 */
export function hasRoutePermission(
  routePath: string,
  userRoles: string[]
): boolean {
  // 如果路由不在权限映射中，默认允许访问
  if (!PERMISSION_ROUTES[routePath]) {
    return true;
  }

  // 检查用户角色是否包含所需权限
  const requiredRoles = PERMISSION_ROUTES[routePath];
  return userRoles.some(role => requiredRoles.includes(role));
}

/**
 * 获取重定向URL
 */
export function getRedirectUrl(to: string, from?: string): string {
  const redirect = from || "/home";
  return `/login?redirect=${encodeURIComponent(redirect)}`;
}
