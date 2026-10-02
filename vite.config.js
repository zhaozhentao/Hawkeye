import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  // 静态资源部署 basePath（H5 构建/预览时资源前缀，需以 / 结尾）
  base: '/admin-cdn/cdn/eye/',
  resolve: {
    // 配置路径别名
    alias: {
      '@': path.resolve(__dirname, 'src') // @ 指向 src 目录
    }
  },
  plugins: [
    uni(),
  ],
})
