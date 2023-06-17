import type { Plugin } from 'vite'

interface UniPagesOptions {
  /**
   * The default application entry page is the home page
   * @default 'pages/index' or 'pages/index/index'
   */
  homePage?: string
}

export function VitePluginUniPages(options: UniPagesOptions = {}): Plugin {
  return {
    name: 'vite-plugin-uni-pages',
    enforce: 'pre',
  }
}
