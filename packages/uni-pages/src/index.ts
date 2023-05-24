import type { Plugin } from 'vite'

interface UniPagesOptions {

}

export function VitePluginUniPages(options: UniPagesOptions = {}): Plugin {
  return {
    name: 'vite-plugin-uni-pages',
    enforce: 'pre',
  }
}
