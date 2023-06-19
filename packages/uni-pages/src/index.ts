import { join } from 'node:path'
import { spawn } from 'node:child_process'
import chokidar from 'chokidar'
import { type Plugin, createLogger } from 'vite'
import MagicString from 'magic-string'
import { checkJSONFileExist } from '@uni-helper/vite-plugin-uni-utils'
import type { UniPagesOptions } from './types'
import { PageContext } from './context'
import { MODULE_ID_VIRTUAL, OUTPUT_NAME, RESOLVED_MODULE_ID_VIRTUAL } from './constants'

export * from './config'

export function VitePluginUniPages(options: UniPagesOptions = {}): Plugin {
  let ctx: PageContext

  // check if pages.json exists in src folder, if not, create it
  const resolvedPagesJSONPath = join(process.cwd(), options.outDir ?? 'src', OUTPUT_NAME)
  const isValidated = checkJSONFileExist(resolvedPagesJSONPath, JSON.stringify({ pages: [{ path: '' }] }, null, 2))

  return {
    name: 'vite-plugin-uni-pages',
    enforce: 'pre',
    async configResolved(config) {
      ctx = new PageContext(options, config.root)
      const logger = createLogger(undefined, {
        prefix: '[vite-plugin-uni-pages]',
      })
      ctx.setLogger(logger)
      await ctx.updatePagesJSON()

      if (config.command === 'build') {
        if (!isValidated) {
          ctx.logger?.warn('In build mode, if `pages.json` does not exist, the plugin cannot create the complete `pages.json` before the uni-app, so it restarts the build.', {
            timestamp: true,
          })
          await restart()
        }

        if (config.build.watch)
          ctx.setupWatcher(chokidar.watch([...ctx.options.dirs, ...ctx.options.subPackages]))
      }
    },
    // Applet do not support custom block, so we need to remove the route block here
    async transform(code: string, id: string) {
      if (!/\.vue$/.test(id))
        return null
      const s = new MagicString(code.toString())
      const routeBlockMatches = s.original.matchAll(
        /<route[^>]*>([\s\S]*?)<\/route>/g,
      )

      for (const match of routeBlockMatches) {
        const index = match.index!
        const length = match[0].length
        s.remove(index, index + length)
      }
      return s.toString()
    },
    configureServer(server) {
      ctx.setupViteServer(server)
    },
    resolveId(id) {
      if (id === MODULE_ID_VIRTUAL)
        return RESOLVED_MODULE_ID_VIRTUAL
    },
    load(id) {
      if (id === RESOLVED_MODULE_ID_VIRTUAL)
        return ctx.virtualModule()
    },
  }
}

export { VitePluginUniPages as UniPages }

async function restart() {
  return new Promise((resolve) => {
    const build = spawn(process.argv.shift()!, process.argv, {
      cwd: process.cwd(),
      detached: true,
      env: process.env,
    })
    build.stdout?.pipe(process.stdout)
    build.stderr?.pipe(process.stderr)
    build.on('close', (code) => {
      resolve(process.exit(code!))
    })
  })
}
