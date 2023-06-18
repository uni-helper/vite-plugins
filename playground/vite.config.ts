import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { UniPages } from '@uni-helper/vite-plugins'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    UniPages({
      homePage: 'pages/index',
      subPackages: ['src/pages-sub'],
    }),
    uni(),
  ],
})
