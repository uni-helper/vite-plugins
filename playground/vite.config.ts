import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { UniManifest, UniPages } from '@uni-helper/vite-plugins'
import { UniTest } from '@uni-helper/vite-plugin-uni-test'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    UniTest(),
    UniPages({
      homePage: 'pages/index',
      subPackages: ['src/pages-sub'],
    }),
    UniManifest(),
    uni(),
  ],
})
