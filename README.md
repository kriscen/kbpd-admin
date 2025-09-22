# Vue Admin 管理系统

基于 Vue 3 + TypeScript + Vite 构建的现代化管理系统模板。

## ✨ 特性

- 🚀 **Vue 3** - 使用最新的 Vue 3 Composition API
- 🔥 **TypeScript** - 完整的 TypeScript 支持
- ⚡ **Vite** - 极速的开发体验
- 🎨 **Element Plus** - 优秀的 Vue 3 UI 组件库
- 📦 **自动导入** - API 和组件自动导入
- 🎯 **Mock 数据** - 内置 Mock 数据支持
- 🔧 **代码规范** - ESLint + Prettier + Stylelint
- 🐶 **Git 钩子** - Husky + 提交规范检查
- 📱 **响应式设计** - 支持移动端适配

## 🛠️ 技术栈

- **框架**: Vue 3.5+
- **语言**: TypeScript 5.8+
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

# 进入项目目录
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
# 启动开发服务器
pnpm dev

# 或
npm run dev
```

启动后访问 http://localhost:5173

## 📦 构建

```bash
# 构建生产环境
pnpm build

# 预览构建结果
pnpm preview
```

## 📋 代码规范

```bash
# ESLint 检查
pnpm lint

# ESLint 自动修复
pnpm fix

# 格式化代码
pnpm format

# Stylelint 检查
pnpm lint:style
```

## 📁 项目结构

```
├── .husky                      # 代码提交前校验配置文件
├── .vscode                     # IDE 工具推荐配置文件
│   ├── settings.json          # 设置扩展程序或 vscode 编辑器的一些属性
│   └── vue3.0.code-snippets   # vue3.0 代码片段
├── build                       # 构建工具
│   ├── cdn.ts                 # 打包时采用 cdn 模式
│   ├── compress.ts            # 打包时启用 gzip 压缩或 brotli 压缩
│   ├── info.ts                # 输出打包信息（大小、用时）
│   ├── optimize.ts            # vite 依赖预构建配置项
│   ├── plugins.ts             # vite 相关插件存放处
│   └── utils.ts               # 构建工具常用方法抽离
├── mock                        # mock 模拟后台数据
│   ├── asyncRoutes.ts         # 模拟后台返回动态路由
│   └── user.ts                # 用户相关 mock 数据
├── public                      # 静态资源
│   ├── audio                  # 音频文件
│   ├── html                   # 静态 iframe 页面
│   ├── wasm                   # wasm 文件以及胶水代码
│   ├── favicon.ico            # favicon
│   ├── logo.svg               # logo
│   └── platform-config.json   # 全局配置文件（打包后修改也可生效）
├── src
│   ├── api                    # 接口请求统一管理
│   │   └── sys/user           # 用户相关接口
│   ├── assets                 # 字体、图片等静态资源
│   ├── components             # 自定义通用组件
│   │   ├── SvgIcon            # SVG 图标组件
│   │   └── index.ts           # 组件导出
│   ├── config                 # 获取平台动态全局配置
│   ├── directives             # 自定义指令
│   ├── layout                 # 主要页面布局
│   ├── plugins                # 处理一些库或插件，导出更方便的 api
│   ├── router                 # 路由配置
│   │   ├── index.ts           # 路由主配置
│   │   └── routes.ts          # 路由定义
│   ├── store                  # pinia 状态管理
│   ├── styles                 # 全局样式
│   │   ├── index.scss         # 样式入口文件
│   │   ├── reset.scss         # 重置样式
│   │   └── variable.scss      # 样式变量
│   ├── utils                  # 全局工具方法
│   │   └── request.ts         # 请求封装
│   ├── views                  # 存放编写业务代码页面
│   │   ├── 404                # 404 页面
│   │   ├── home               # 首页
│   │   └── login              # 登录页
│   ├── App.vue                # 入口页面
│   ├── main.ts                # 入口文件
│   └── vite-env.d.ts          # vite 环境类型声明
├── types                       # 全局 TS 类型配置
│   ├── directives.d.ts        # 全局自定义指令类型声明
│   ├── global-components.d.ts # 自定义全局组件类型声明
│   ├── global.d.ts            # 全局类型声明
│   ├── index.d.ts             # 零散的全局类型声明
│   ├── router.d.ts            # 全局路由类型声明
│   ├── shims-tsx.d.ts         # tsx 文件类型支持
│   ├── shims-vue.d.ts         # vue 文件类型支持
│   └── virtual.d.ts           # 虚拟模块类型声明
├── .env                        # 全局环境变量配置
├── .env.development           # 开发环境变量配置
├── .gitignore                 # git 提交忽略文件
├── .prettierignore            # prettier 语法检查忽略文件
├── .prettierrc.js             # prettier 插件配置
├── auto-imports.d.ts          # 自动导入类型声明
├── components.d.ts            # 组件自动导入类型声明
├── commitlint.config.js       # git 提交前检查配置
├── eslint.config.js           # eslint 语法检查配置
├── index.html                 # html 主入口
├── package.json               # 依赖包管理以及命令配置
├── pnpm-lock.yaml             # pnpm 锁定文件
├── README.md                  # 项目说明文档
├── stylelint.config.js        # stylelint 配置
├── tsconfig.json              # typescript 配置
├── tsconfig.app.json          # 应用 typescript 配置
├── tsconfig.node.json         # node typescript 配置
└── vite.config.ts             # vite 配置
```

## 🔧 配置说明

### 环境变量

项目支持多环境配置:

- `.env` - 全局环境变量
- `.env.development` - 开发环境变量
- `.env.production` - 生产环境变量
- `.env.staging` - 预发布环境变量

### 代码规范

项目集成了完整的代码规范配置：

- **ESLint**: JavaScript/TypeScript 代码检查
- **Prettier**: 代码格式化
- **Stylelint**: CSS/SCSS 样式检查
- **Husky**: Git 钩子管理
- **Commitlint**: 提交信息规范检查

### 自动导入

项目配置了 API 和组件的自动导入，无需手动引入：

- Vue 相关 API（ref, reactive, computed 等）
- Vue Router API
- Element Plus 组件
- 自定义组件

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
