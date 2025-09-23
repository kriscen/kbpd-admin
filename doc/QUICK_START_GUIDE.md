# KBPD Admin 快速入门指南

> 5分钟快速了解和使用KBPD Admin系统

## 🚀 快速开始

### 1. 环境准备

```bash
# 检查Node.js版本 (需要 >= 16.0.0)
node --version

# 安装依赖
pnpm install

# 启动开发服务器
npm run dev
```

### 2. 系统登录

访问 `http://localhost:5173`，使用以下测试账号：

| 用户名 | 密码   | 角色       | 权限范围      |
| ------ | ------ | ---------- | ------------- |
| admin  | 111111 | 平台管理员 | 所有功能      |
| system | 111111 | 系统管理员 | 系统管理+监控 |

## 🔧 模式切换

### Mock模式 (开发推荐)

```bash
# .env.dev
VITE_LOGIN_MODE=mock
```

- ✅ 快速开发调试
- ✅ 完整的权限功能
- ✅ 不依赖后端服务

### OAuth2模式 (生产环境)

```bash
# .env.prod
VITE_LOGIN_MODE=oauth2
VITE_OAUTH2_AUTH_URL=https://your-oauth2-server.com/oauth2/authorize
VITE_OAUTH2_TOKEN_URL=https://your-oauth2-server.com/oauth2/token
VITE_OAUTH2_CLIENT_ID=your-client-id
VITE_OAUTH2_REDIRECT_URI=https://your-domain.com/auth/callback
```

## 📊 数据对接指南

### Mock数据结构 (开发环境)

```typescript
// 用户数据格式
interface MockUser {
  userId: number;
  username: string;
  avatar: string;
  roles: string[];
  buttons: string[]; // 按钮权限
  routes: string[]; // 路由权限
  token: string;
}

// 菜单数据格式
interface MockMenu {
  id: string;
  path: string;
  name: string;
  meta: {
    title: string;
    icon?: string;
    roles?: string[];
    permission?: string;
  };
  children?: MockMenu[];
}
```

### 真实API接口规范 (生产环境)

#### 1. 用户登录接口

```typescript
// OAuth2 Token接口
POST /oauth2/token
Content-Type: application/x-www-form-urlencoded

{
  grant_type: "authorization_code",
  client_id: "your-client-id",
  code: "authorization-code",
  redirect_uri: "callback-url"
}

// 响应格式
{
  access_token: "eyJhbGciOiJIUzI1NiIs...",
  refresh_token: "eyJhbGciOiJIUzI1NiIs...",
  token_type: "Bearer",
  expires_in: 3600
}
```

#### 2. 获取用户信息接口

```typescript
GET /user/info
Authorization: Bearer {access_token}

// 响应格式 (需要与Mock数据结构保持一致)
{
  code: 200,
  data: {
    checkUser: {
      userId: 1,
      username: "admin",
      avatar: "https://example.com/avatar.jpg",
      roles: ["平台管理员"],
      buttons: ["system.user", "system.role"],
      routes: ["home", "system"]
    }
  }
}
```

#### 3. 获取菜单权限接口

```typescript
GET /menu/list
Authorization: Bearer {access_token}

// 响应格式 (需要与Mock菜单结构保持一致)
{
  code: 200,
  data: [
    {
      id: "system",
      path: "/system",
      name: "System",
      meta: {
        title: "系统管理",
        icon: "Setting",
        roles: ["平台管理员"]
      },
      children: [...]
    }
  ]
}
```

## 🔄 Mock到真实数据的迁移步骤

### 第一步：准备后端接口

1. 实现上述三个核心API接口
2. 确保响应数据格式与Mock保持一致
3. 配置OAuth2认证服务器

### 第二步：修改环境配置

```bash
# 修改 .env.prod 文件
VITE_LOGIN_MODE=oauth2
VITE_APP_BASE_API=https://your-api-server.com/api
VITE_OAUTH2_AUTH_URL=https://your-oauth2-server.com/oauth2/authorize
# ... 其他OAuth2配置
```

### 第三步：数据适配 (如果格式不同)

```typescript
// src/utils/dataAdapter.ts
export class DataAdapter {
  // 如果后端数据格式与Mock不同，在这里进行转换
  static adaptUserInfo(backendData: any): UserInfo {
    return {
      userId: backendData.user.id,
      username: backendData.user.name,
      avatar: backendData.user.profile_picture || CONSTANTS.DEFAULT_AVATAR,
      roles: backendData.user.roles || [],
      buttons: backendData.permissions || [],
      routes: backendData.accessible_routes || []
    };
  }
}
```

### 第四步：测试验证

1. 本地切换到OAuth2模式测试
2. 验证登录流程完整性
3. 验证权限控制准确性
4. 进行集成测试

## 🏗️ 快速扩展

### 添加新页面

```bash
# 1. 创建页面组件
mkdir src/views/example
touch src/views/example/index.vue

# 2. 添加路由配置
# 编辑 src/router/routes.ts

# 3. 配置菜单权限
# 编辑 mock/user.ts 或后端菜单接口
```

### 添加新API接口

```bash
# 1. 定义类型
touch src/api/example/type.ts

# 2. 创建API函数
touch src/api/example/index.ts

# 3. 在组件中使用
# import { getExampleList } from '@/api/example'
```

## 🔧 常用脚本

```bash
# 开发服务器
npm run dev

# 代码检查
npm run lint

# 代码格式化
npm run format

# 构建生产版本
npm run build:prod

# 预览构建结果
npm run preview
```

## 🆘 常见问题

**Q: 登录后权限菜单不显示？**
A: 检查用户的 `routes` 字段是否包含对应的路由权限

**Q: OAuth2模式下登录失败？**
A: 检查 OAuth2 配置参数是否正确，特别是 `client_id` 和回调地址

**Q: 页面刷新后用户状态丢失？**
A: 检查 `localStorage` 中是否正确保存了 token

**Q: 标签页出现重复？**
A: 在开发环境下运行 `window.cleanTags()` 清理重复标签

## 📚 更多文档

- [完整设计文档](./COMPREHENSIVE_DESIGN_GUIDE.md) - 详细的系统设计和技术实现
- [布局配置指南](./LAYOUT_CONFIG_GUIDE.md) - 布局系统配置说明
- [登录测试指南](./LOGIN_TEST_GUIDE.md) - 登录功能测试说明
- [首页布局指南](./HOME_LAYOUT_GUIDE.md) - 首页功能说明

---

_如有问题，请查看完整设计文档或提交 Issue_
