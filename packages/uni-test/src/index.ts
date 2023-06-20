import type { Plugin } from 'vite'

export function VitePluginUniTest(): Plugin {
  console.log('vite-plugin-uni-test', process.cwd())
  return {
    name: 'vite-plugin-uni-test',
    enforce: 'pre',
    async configResolved(config) {
      console.log('configResolved')
    },
    configureServer(server) {
      console.log('configureServer')
    },
  }
}

export { VitePluginUniTest as UniTest }
