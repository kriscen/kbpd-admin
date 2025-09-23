import { ref, computed, reactive } from "vue";
import type { TagView, TagsViewContextMenu } from "../types";
import { useRouter, useRoute } from "vue-router";

// 标签页列表
const tagsList = ref<TagView[]>([]);

// 右键菜单状态
const contextMenu = reactive<TagsViewContextMenu>({
  visible: false,
  top: 0,
  left: 0,
  selectedTag: undefined
});

export function useTag() {
  const router = useRouter();
  const route = useRoute();

  // 添加标签页
  const addTag = (tag: TagView) => {
    const existingIndex = tagsList.value.findIndex(
      item => item.path === tag.path
    );

    if (existingIndex > -1) {
      // 更新现有标签
      tagsList.value[existingIndex] = {
        ...tagsList.value[existingIndex],
        ...tag
      };
    } else {
      // 添加新标签
      tagsList.value.push(tag);
    }

    // 保存到本地存储
    saveTagsToStorage();
  };

  // 删除标签页
  const removeTag = (targetPath: string) => {
    const targetIndex = tagsList.value.findIndex(
      tag => tag.path === targetPath
    );

    if (targetIndex > -1) {
      const targetTag = tagsList.value[targetIndex];
      tagsList.value.splice(targetIndex, 1);

      // 如果删除的是当前页面，需要跳转
      if (targetTag.path === route.path) {
        const nextTag =
          tagsList.value[targetIndex] || tagsList.value[targetIndex - 1];
        if (nextTag) {
          router.push(nextTag.path);
        } else {
          router.push("/");
        }
      }

      saveTagsToStorage();
    }
  };

  // 关闭其他标签页
  const removeOtherTags = (currentPath: string) => {
    tagsList.value = tagsList.value.filter(
      tag => tag.path === currentPath || tag.affix
    );
    saveTagsToStorage();
  };

  // 关闭左侧标签页
  const removeLeftTags = (currentPath: string) => {
    const currentIndex = tagsList.value.findIndex(
      tag => tag.path === currentPath
    );
    if (currentIndex > -1) {
      tagsList.value = tagsList.value.filter(
        (tag, index) => index >= currentIndex || tag.affix
      );
      saveTagsToStorage();
    }
  };

  // 关闭右侧标签页
  const removeRightTags = (currentPath: string) => {
    const currentIndex = tagsList.value.findIndex(
      tag => tag.path === currentPath
    );
    if (currentIndex > -1) {
      tagsList.value = tagsList.value.filter(
        (tag, index) => index <= currentIndex || tag.affix
      );
      saveTagsToStorage();
    }
  };

  // 关闭所有标签页
  const removeAllTags = () => {
    tagsList.value = tagsList.value.filter(tag => tag.affix);

    // 跳转到首页
    if (tagsList.value.length > 0) {
      router.push(tagsList.value[0].path);
    } else {
      router.push("/");
    }

    saveTagsToStorage();
  };

  // 刷新当前页面
  const refreshCurrentPage = () => {
    const currentTag = tagsList.value.find(tag => tag.path === route.path);
    if (currentTag) {
      // 先跳转到一个临时页面，再跳转回来实现刷新
      router.replace("/redirect" + route.path);
    }
  };

  // 显示右键菜单
  const showContextMenu = (tag: TagView, event: MouseEvent) => {
    event.preventDefault();
    contextMenu.selectedTag = tag;
    contextMenu.visible = true;
    contextMenu.left = event.clientX;
    contextMenu.top = event.clientY;
  };

  // 隐藏右键菜单
  const hideContextMenu = () => {
    contextMenu.visible = false;
    contextMenu.selectedTag = undefined;
  };

  // 保存标签页到本地存储
  const saveTagsToStorage = () => {
    localStorage.setItem("tags-view", JSON.stringify(tagsList.value));
  };

  // 从本地存储加载标签页
  const loadTagsFromStorage = () => {
    const stored = localStorage.getItem("tags-view");
    if (stored) {
      try {
        const tags = JSON.parse(stored);
        // 清理重复的标签和不应该存在的标签
        const uniqueTags = tags.reduce((acc: TagView[], tag: TagView) => {
          // 过滤掉不应该存在的标签（404、登录等）
          if (
            isExcludedRoute({
              path: tag.path,
              meta: { title: tag.title },
              name: tag.name
            })
          ) {
            return acc;
          }

          // 对于首页标签，统一使用/home路径
          if (tag.path === "/" || (tag.path === "/home" && tag.affix)) {
            const existingHomeIndex = acc.findIndex(
              t => t.path === "/home" || t.path === "/" || t.affix === true
            );
            if (existingHomeIndex === -1) {
              // 没有首页标签，添加一个统一的
              acc.unshift({
                path: "/home",
                title: "首页",
                affix: true,
                keepAlive: false
              });
            }
          } else {
            // 非首页标签正常处理
            const existingIndex = acc.findIndex(t => t.path === tag.path);
            if (existingIndex > -1) {
              acc[existingIndex] = tag; // 更新现有标签
            } else {
              acc.push(tag); // 添加新标签
            }
          }
          return acc;
        }, []);
        tagsList.value = uniqueTags;
      } catch (error) {
        console.warn("Failed to parse tags from localStorage:", error);
        tagsList.value = [];
      }
    }
  };

  // 初始化标签页
  const initTags = () => {
    loadTagsFromStorage();

    // 检查是否已经有首页标签（支持多种路径格式）
    const hasHomeTag = tagsList.value.some(
      tag => tag.path === "/home" || tag.path === "/" || tag.affix === true
    );

    // 只有在没有任何首页标签时才添加
    if (!hasHomeTag) {
      const homeTag: TagView = {
        path: "/home",
        title: "首页",
        affix: true,
        keepAlive: false
      };
      tagsList.value.unshift(homeTag);
      saveTagsToStorage();
    }
  };

  // 清理重复标签的工具函数
  const cleanDuplicateTags = () => {
    // 过滤掉不应该存在的标签
    tagsList.value = tagsList.value.filter(tag => {
      return !isExcludedRoute({
        path: tag.path,
        meta: { title: tag.title },
        name: tag.name
      });
    });

    // 保存到本地存储
    saveTagsToStorage();

    console.log("清理不合理标签完成");
  };

  // 根据当前路由添加标签
  const addCurrentRouteTag = () => {
    const { path, meta, name } = route;
    if (path && meta?.title && !isExcludedRoute(route)) {
      const tag: TagView = {
        path,
        name: name as string,
        title: meta.title as string,
        keepAlive: meta.keepAlive as boolean,
        affix: meta.affix as boolean,
        close: !meta.affix
      };
      addTag(tag);
    }
  };

  // 判断是否应该排除的路由
  const isExcludedRoute = (routeInfo: any) => {
    // 排除的路由类型：
    // 1. 登录相关页面
    if (routeInfo.path === "/login" || routeInfo.path.startsWith("/auth/")) {
      return true;
    }

    // 2. 404相关页面
    if (
      routeInfo.path === "/404" ||
      routeInfo.path === "/404-content" ||
      routeInfo.name === "404" ||
      routeInfo.name === "404Content"
    ) {
      return true;
    }

    // 3. 重定向页面
    if (routeInfo.path.startsWith("/redirect")) {
      return true;
    }

    // 4. 标记为隐藏的页面
    if (routeInfo.meta?.hidden === true) {
      return true;
    }

    // 5. 没有标题的页面
    if (!routeInfo.meta?.title) {
      return true;
    }

    return false;
  };

  // 计算属性
  const currentTags = computed(() => tagsList.value);
  const activeTagPath = computed(() => route.path);

  // 是否显示标签页
  const showTags = computed(() => tagsList.value.length > 1);

  // 右键菜单项
  const contextMenuItems = computed(() => [
    {
      label: "重新加载",
      icon: "Refresh",
      action: () => refreshCurrentPage(),
      show: true
    },
    {
      label: "关闭当前",
      icon: "Close",
      action: () => {
        if (contextMenu.selectedTag) {
          removeTag(contextMenu.selectedTag.path);
        }
      },
      show: contextMenu.selectedTag?.close !== false
    },
    {
      label: "关闭左侧",
      icon: "Back",
      action: () => {
        if (contextMenu.selectedTag) {
          removeLeftTags(contextMenu.selectedTag.path);
        }
      },
      show: true
    },
    {
      label: "关闭右侧",
      icon: "Right",
      action: () => {
        if (contextMenu.selectedTag) {
          removeRightTags(contextMenu.selectedTag.path);
        }
      },
      show: true
    },
    {
      label: "关闭其他",
      icon: "CircleClose",
      action: () => {
        if (contextMenu.selectedTag) {
          removeOtherTags(contextMenu.selectedTag.path);
        }
      },
      show: true
    },
    {
      label: "关闭全部",
      icon: "FolderDelete",
      action: () => removeAllTags(),
      show: true
    }
  ]);

  // 监听页面点击，隐藏右键菜单
  document.addEventListener("click", hideContextMenu);

  return {
    tagsList: currentTags,
    activeTagPath,
    showTags,
    contextMenu: computed(() => contextMenu),
    contextMenuItems,

    addTag,
    removeTag,
    removeOtherTags,
    removeLeftTags,
    removeRightTags,
    removeAllTags,
    refreshCurrentPage,
    showContextMenu,
    hideContextMenu,
    initTags,
    addCurrentRouteTag,
    cleanDuplicateTags,
    isExcludedRoute
  };
}
