import { join } from 'node:path'
import { type Plugin, createLogger, normalizePath } from 'vite'
import { checkJSONFileExist, restart } from '@uni-helper/vite-plugin-uni-utils'
import type { UniManifestOptions } from './types'
import { ManifestContext } from './context'

import { OUTPUT_NAME } from './constants'

export * from './config'

export function VitePluginUniManifest(userOptions: UniManifestOptions = {}): Plugin {
  let ctx: ManifestContext

  // check if manifest.json exists in src folder, if not, create it
  const resolvedPagesJSONPath = normalizePath(join(process.cwd(), 'src', OUTPUT_NAME))
  const isValidated = checkJSONFileExist(resolvedPagesJSONPath, JSON.stringify({}, null, 2))
  return {
    name: 'vite-plugin-uni-manifest',
    enforce: 'pre',
    async configResolved(config) {
      ctx = new ManifestContext(userOptions, config.root)
      const logger = createLogger(undefined, {
        prefix: '[vite-plugin-uni-manifest]',
      })
      ctx.setLogger(logger)
      await ctx.updateManifestJSON()

      if (config.command === 'build') {
        if (!isValidated) {
          ctx.logger?.warn('In build mode, if `manifest.json` does not exist, the plugin cannot create the complete `pages.json` before the uni-app, so it restarts the build.', {
            timestamp: true,
          })
          await restart()
        }
      }
    },
    configureServer(server) {
      ctx.setupViteServer(server)
    },
  }
}

export { VitePluginUniManifest as UniManifest }
