import { join } from 'node:path'
import { loadConfig } from 'unconfig'
import { type Logger, type ViteDevServer, normalizePath } from 'vite'
import { resolveConfigFile, writeFile } from '@uni-helper/vite-plugin-uni-utils'

import type { FSWatcher } from 'chokidar'
import type { ManifestConfig } from './config'
import { resolveOptions } from './options'
import type { ResolvedOptions, UniManifestOptions } from './types'
import { CONFIG_FILE_GLOB, CONFIG_FILE_NAME, OUTPUT_NAME } from './constants'

export class ManifestContext {
  private _server: ViteDevServer | undefined

  rawOptions: UniManifestOptions
  options: ResolvedOptions
  logger?: Logger

  resolvedManifestJSONPath = ''

  constructor(userOptions: UniManifestOptions, viteRoot: string = process.cwd()) {
    this.rawOptions = userOptions
    this.options = resolveOptions(userOptions)
    this.resolvedManifestJSONPath = normalizePath(join(viteRoot, 'src', OUTPUT_NAME))
  }

  async loadManifestConfig() {
    const { config } = await loadConfig<ManifestConfig>({ sources: [{ files: CONFIG_FILE_NAME }] })
    if (!config) {
      this.logger?.warn('Can\'t found manifest.config, please create manifest.config.(ts|mts|cts|js|cjs|mjs|json)')
      process.exit(-1)
    }
    return config
  }

  async updateManifestJSON() {
    const resolvedManifestConfig = await this.loadManifestConfig()
    const config = {
      ...resolvedManifestConfig,
      ...this.options,
    }
    const manifestJSON = JSON.stringify(config, null, this.options.minify ? undefined : 2)
    writeFile(this.resolvedManifestJSONPath, manifestJSON)
  }

  setupViteServer(server: ViteDevServer) {
    if (this._server === server)
      return

    this._server = server
    this.setupWatcher(server.watcher)
  }

  async setupWatcher(watcher: FSWatcher) {
    const configPath = resolveConfigFile(CONFIG_FILE_GLOB)
    watcher.add(configPath)
  }

  setLogger(logger: Logger) {
    this.logger = logger
  }
}
