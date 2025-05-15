import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react';
import path from 'path'; // 如果编辑器提示 path 模块找不到，则可以安装一下 @types/node -> npm i @types/node -D
import UnoCSS from 'unocss/vite'
import Pages from 'vite-plugin-pages'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  const { VITE_PORT, VITE_BASE_URL } = env

  return {
    base: VITE_BASE_URL,
    server: {
      port: Number.parseInt(VITE_PORT),
    },

    plugins: [
      Pages({
        exclude: ['**/component{,s}/**'],
      }),
      react(),
      UnoCSS(),
   
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      },
    },
  }
});