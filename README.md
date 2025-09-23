# KBPD Admin 管理系统

> 基于 Vue 3 + TypeScript + Vite 构建的现代化管理系统，支持双模式登录认证与完整的权限管理

## ✨ 核心特性

- 🔐 **双模式认证** - Mock开发模式 + OAuth2生产模式
- 👥 **权限管理** - 基于角色的菜单权限和按钮权限控制
- 🎨 **响应式布局** - 支持垂直/水平/混合三种布局模式
- 🏷️ **智能标签页** - 标签页缓存、右键菜单、持久化存储
- 🌙 **主题系统** - 明暗主题切换 + 自定义主题色
- 📱 **移动端适配** - 完美适配桌面端、平板端、移动端
- 🚀 **现代技术栈** - Vue 3 + TypeScript + Pinia + Element Plus
- ⚡ **开发体验** - Vite构建 + 自动导入 + Mock数据 + 热重载

## 📖 文档导航

| 文档类型            | 链接                                                                 | 描述                         |
| ------------------- | -------------------------------------------------------------------- | ---------------------------- |
| 🚀 **快速入门**     | [QUICK_START_GUIDE.md](./doc/QUICK_START_GUIDE.md)                   | 5分钟快速上手指南            |
| 📚 **完整设计文档** | [COMPREHENSIVE_DESIGN_GUIDE.md](./doc/COMPREHENSIVE_DESIGN_GUIDE.md) | 系统设计、技术架构、开发指南 |
| 🎨 **布局配置**     | [LAYOUT_CONFIG_GUIDE.md](./doc/LAYOUT_CONFIG_GUIDE.md)               | 布局系统配置说明             |
| 🏠 **首页说明**     | [HOME_LAYOUT_GUIDE.md](./doc/HOME_LAYOUT_GUIDE.md)                   | 首页功能使用指南             |
| 🔐 **登录测试**     | [LOGIN_TEST_GUIDE.md](./doc/LOGIN_TEST_GUIDE.md)                     | 登录功能测试指南             |
| 🔍 **代码审查**     | [CODE_REVIEW.md](./doc/CODE_REVIEW.md)                               | 代码质量评估报告             |

## 🚀 快速开始

## 🛠️ 技术栈

- **框架**: Vue 3.5+
- **语言**: TypeScript 5.8+
- **状态管理**: Pinia 3.0+
- **构建工具**: Vite 6.3+
- **UI 框架**: Element Plus 2.9+
- **路由**: Vue Router 4.5+
- **HTTP 客户端**: Axios 1.9+
- **样式**: Sass/SCSS
- **代码规范**: ESLint + Prettier + Stylelint
- **提交规范**: Husky + Commitlint

## 📦 安装

```bash
# 克隆项目
git clone <repository-url>

cd kbpd-admin

# 安装依赖
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

## 🚀 开发

```bash
# 启动开发服务器 (默认使用Mock模式)
npm run dev

# 启动生产模式服务器
npm run build && npm run preview
```

启动后访问 http://localhost:5173

## 🧪 测试登录

系统支持两种登录模式：

### Mock模式 (开发环境默认)

- **账号**: admin
- **密码**: 111111
- **角色**: 平台管理员

或者

- **账号**: system
- **密码**: 111111
- **角色**: 系统管理员

### OAuth2模式 (生产环境)

点击登录页面的OAuth2登录按钮，跳转到认证中心进行登录。

## 📦 构建

```bash
# 构建开发环境
npm run build:dev

# 构建生产环境
npm run build:prod

# 预览构建结果
npm run preview
```

## 📋 代码规范

```bash
# ESLint 检查
npm run lint

# ESLint 自动修复
npm run fix

# 格式化代码
npm run format

# Stylelint 检查
npm run lint:style
```

## 📁 项目结构

```
src/
├── api/                    # API接口层
│   └── sys/               # 系统模块API
│       ├── user/          # 用户相关接口
│       └── menu/          # 菜单相关接口
├── components/            # 通用组件
│   ├── SvgIcon/          # SVG图标组件
│   └── index.ts          # 组件导出
├── config/               # 配置文件
│   └── index.ts          # 应用配置
├── layout/               # 布局系统
│   ├── components/       # 布局组件
│   ├── hooks/           # 布局钩子函数
│   ├── styles/          # 布局样式
│   └── types.ts         # 布局类型定义
├── router/              # 路由配置
│   ├── index.ts         # 路由实例
│   ├── routes.ts        # 路由配置
│   └── dynamicRoutes.ts # 动态路由
├── store/               # 状态管理
│   ├── user.ts          # 用户状态
│   └── menu.ts          # 菜单状态
├── styles/              # 全局样式
├── utils/               # 工具函数
│   ├── request.ts       # 请求封装
│   ├── env.ts           # 环境配置
│   ├── errorHandler.ts  # 错误处理
│   └── routePermission.ts # 路由权限
├── views/               # 页面组件
│   ├── login/           # 登录页面
│   ├── home/            # 首页
│   ├── system/          # 系统管理
│   ├── content/         # 内容管理
│   └── 404/             # 404页面
├── App.vue              # 根组件
├── main.ts              # 应用入口
└── vite-env.d.ts        # 类型声明
```

## 🔧 配置说明

### 环境变量

项目支持多环境配置:

- `.env.dev` - 开发环境变量 (默认使用Mock模式)
- `.env.prod` - 生产环境变量 (默认使用OAuth2模式)

### 登录模式切换

```bash
# .env.dev 或 .env.prod
VITE_LOGIN_MODE=mock     # Mock开发模式
VITE_LOGIN_MODE=oauth2   # OAuth2生产模式
```

### OAuth2配置

```bash
# OAuth2相关配置
VITE_OAUTH2_AUTH_URL=https://your-oauth2-server.com/oauth2/authorize
VITE_OAUTH2_TOKEN_URL=https://your-oauth2-server.com/oauth2/token
VITE_OAUTH2_CLIENT_ID=your-client-id
VITE_OAUTH2_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_OAUTH2_SCOPE=read write
```

## 🤝 贡献

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📝 提交规范

项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

示例：

```bash
git commit -m "feat: 添加用户管理页面"
git commit -m "fix: 修复登录页面验证码显示问题"
```

## 📄 许可证

[MIT License](LICENSE)

## ❓ 支持

如果您有任何问题或建议，请创建一个 [Issue](../../issues)。
