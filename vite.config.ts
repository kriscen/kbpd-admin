import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { viteMockServe } from "vite-plugin-mock";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // 根据环境变量决定是否启用Mock
  const enableMock = process.env.VITE_ENABLE_MOCK === "true" || mode === "dev";

  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      }),
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        // Specify symbolId format
        symbolId: "icon-[dir]-[name]"
      }),
      viteMockServe({
        mockPath: "mock",
        enable: enableMock,
        watchFiles: true,
        logger: true
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve("./src") // 相对路径别名配置，使用 @ 代替 src
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/styles/variable" as *;'
        }
      }
    }
  };
});
