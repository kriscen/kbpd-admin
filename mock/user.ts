//用户信息数据
function createUserList() {
  return [
    {
      userId: 1,
      avatar:
        "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
      username: "admin",
      password: "111111",
      desc: "平台管理员",
      roles: ["平台管理员", "系统管理员"],
      buttons: [
        "cuser.detail",
        "cuser.add",
        "cuser.edit",
        "cuser.delete",
        "system.menu",
        "system.role",
        "system.user",
        "content.article",
        "content.category"
      ],
      routes: ["home", "system", "content", "tools", "monitor"],
      token: "Admin Token",
      email: "admin@example.com",
      phone: "13800138000",
      realName: "系统管理员",
      department: "技术部"
    },
    {
      userId: 2,
      avatar:
        "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
      username: "system",
      password: "111111",
      desc: "系统管理员",
      roles: ["系统管理员"],
      buttons: ["cuser.detail", "system.menu", "system.role", "monitor.server"],
      routes: ["home", "system", "monitor"],
      token: "System Token",
      email: "system@example.com",
      phone: "13900139000",
      realName: "系统管理员",
      department: "运维部"
    },
    {
      userId: 3,
      avatar:
        "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
      username: "test",
      password: "123456",
      desc: "测试用户",
      roles: ["普通用户"],
      buttons: ["cuser.detail"],
      routes: ["home", "content"],
      token: "Test Token",
      email: "test@example.com",
      phone: "13700137000",
      realName: "测试用户",
      department: "测试部"
    }
  ];
}

// 菜单数据
function createMenuList() {
  return [
    {
      id: "system",
      path: "/system",
      name: "System",
      meta: {
        title: "系统管理",
        icon: "Setting",
        roles: ["平台管理员", "系统管理员"]
      },
      children: [
        {
          id: "system-user",
          parentId: "system",
          path: "/system/user",
          name: "SystemUser",
          meta: {
            title: "用户管理",
            icon: "User",
            permission: "system.user",
            keepAlive: true
          }
        },
        {
          id: "system-role",
          parentId: "system",
          path: "/system/role",
          name: "SystemRole",
          meta: {
            title: "角色管理",
            icon: "UserFilled",
            permission: "system.role",
            keepAlive: true
          }
        },
        {
          id: "system-menu",
          parentId: "system",
          path: "/system/menu",
          name: "SystemMenu",
          meta: {
            title: "菜单管理",
            icon: "Menu",
            permission: "system.menu",
            keepAlive: true
          }
        }
      ]
    },
    {
      id: "content",
      path: "/content",
      name: "Content",
      meta: {
        title: "内容管理",
        icon: "Document",
        roles: ["平台管理员", "普通用户"]
      },
      children: [
        {
          id: "content-article",
          parentId: "content",
          path: "/content/article",
          name: "ContentArticle",
          meta: {
            title: "文章管理",
            icon: "Edit",
            permission: "content.article",
            keepAlive: true
          }
        },
        {
          id: "content-category",
          parentId: "content",
          path: "/content/category",
          name: "ContentCategory",
          meta: {
            title: "分类管理",
            icon: "FolderOpened",
            permission: "content.category",
            keepAlive: true
          }
        }
      ]
    },
    {
      id: "tools",
      path: "/tools",
      name: "Tools",
      meta: {
        title: "系统工具",
        icon: "Operation",
        roles: ["平台管理员"]
      },
      children: [
        {
          id: "tools-generator",
          parentId: "tools",
          path: "/tools/generator",
          name: "ToolsGenerator",
          meta: {
            title: "代码生成",
            icon: "Cpu",
            keepAlive: true
          }
        },
        {
          id: "tools-swagger",
          parentId: "tools",
          path: "/tools/swagger",
          name: "ToolsSwagger",
          meta: {
            title: "接口文档",
            icon: "Document",
            keepAlive: true
          }
        }
      ]
    },
    {
      id: "monitor",
      path: "/monitor",
      name: "Monitor",
      meta: {
        title: "系统监控",
        icon: "Monitor",
        roles: ["平台管理员", "系统管理员"]
      },
      children: [
        {
          id: "monitor-server",
          parentId: "monitor",
          path: "/monitor/server",
          name: "MonitorServer",
          meta: {
            title: "服务监控",
            icon: "Platform",
            permission: "monitor.server",
            keepAlive: true
          }
        },
        {
          id: "monitor-log",
          parentId: "monitor",
          path: "/monitor/log",
          name: "MonitorLog",
          meta: {
            title: "日志监控",
            icon: "Warning",
            keepAlive: true
          }
        }
      ]
    }
  ];
}

export default [
  // 用户登录接口
  {
    url: "/api/user/login", //请求地址
    method: "post", //请求方式
    response: ({ body }) => {
      //获取请求体携带过来的用户名与密码
      const { username, password } = body;
      //调用获取用户信息函数,用于判断是否有此用户
      const checkUser = createUserList().find(
        item => item.username === username && item.password === password
      );
      //没有用户返回失败信息
      if (!checkUser) {
        return { code: 201, data: { message: "账号或者密码不正确" } };
      }
      //如果有返回成功信息
      const { token } = checkUser;
      return { code: 200, data: { token } };
    }
  },
  // 获取用户信息
  {
    url: "/api/user/info",
    method: "get",
    response: request => {
      //获取请求头携带token
      const token = request.headers.token;
      //查看用户信息是否包含有次token用户
      const checkUser = createUserList().find(item => item.token === token);
      //没有返回失败的信息
      if (!checkUser) {
        return { code: 201, data: { message: "获取用户信息失败" } };
      }
      //如果有返回成功信息
      return { code: 200, data: { checkUser } };
    }
  },
  // 获取用户菜单列表
  {
    url: "/api/menu/list",
    method: "get",
    response: request => {
      //获取请求头携带token
      const token = request.headers.token;
      //查看用户信息是否包含有次token用户
      const checkUser = createUserList().find(item => item.token === token);
      //没有返回失败的信息
      if (!checkUser) {
        return { code: 201, data: { message: "获取菜单信息失败" } };
      }

      // 获取全部菜单数据
      const allMenus = createMenuList();
      const userRoles = checkUser.roles;

      // 根据用户角色过滤菜单
      const filterMenusByRole = menus => {
        return menus.filter(menu => {
          // 检查角色权限
          if (menu.meta.roles && menu.meta.roles.length > 0) {
            const hasRole = menu.meta.roles.some(role =>
              userRoles.includes(role)
            );
            if (!hasRole) return false;
          }

          // 检查按钮权限
          if (menu.meta.permission) {
            const hasPermission = checkUser.buttons.includes(
              menu.meta.permission
            );
            if (!hasPermission) return false;
          }

          // 递归过滤子菜单
          if (menu.children && menu.children.length > 0) {
            menu.children = filterMenusByRole(menu.children);
          }

          return true;
        });
      };

      const filteredMenus = filterMenusByRole(allMenus);

      //如果有返回成功信息
      return { code: 200, data: filteredMenus };
    }
  }
];
