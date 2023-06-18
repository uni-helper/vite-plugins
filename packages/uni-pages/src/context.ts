import { basename, extname, join, relative } from 'node:path'
import type { FSWatcher } from 'chokidar'
import { type Logger, type ViteDevServer, normalizePath } from 'vite'
import { loadConfig } from 'unconfig'
import { resolveConfigFile, writeFile } from '@uni-helper/vite-plugin-uni-utils'
import type { PagesConfig } from './config/types'
import type { PageMeta, PagePath, ResolvedOptions, SubPageMeta, UniPagesOptions } from './types'
import { resolveOptions } from './options'
import { CONFIG_FILE_GLOB, OUTPUT_NAME } from './constants'
import { getPagesPath, isConfigFile, isTargetFile, mergePageMetaDataArray } from './utils'
import { getRouteBlock } from './customBlock'

export class PageContext {
  private _server: ViteDevServer | undefined

  pagesGlobConfig: PagesConfig | undefined

  pagesPath: PagePath[] = []
  subPagesPath: Record<string, PagePath[]> = {}
  resolvedPagesData: PageMeta[] = []
  resolvedSubPagesData: SubPageMeta[] = []

  resolvedPagesJSONPath = ''

  rawOptions: UniPagesOptions
  options: ResolvedOptions
  logger?: Logger

  constructor(UniPagesOptions: UniPagesOptions, viteRoot: string = process.cwd()) {
    this.rawOptions = UniPagesOptions
    this.options = resolveOptions(UniPagesOptions, viteRoot)
    this.resolvedPagesJSONPath = join(viteRoot, this.options.outDir, OUTPUT_NAME)
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

    watcher.on('add', async (path) => {
      if (!isTargetFile(path) && !isConfigFile(path))
        return
      await this.updatePagesJSON()
    })

    watcher.on('change', async (path) => {
      if (!isTargetFile(path) && !isConfigFile(path))
        return
      await this.updatePagesJSON()
    })

    watcher.on('unlink', async (path) => {
      if (!isTargetFile(path) && !isConfigFile(path))
        return
      await this.updatePagesJSON()
    })
  }

  async loadPagesConfig() {
    const { config } = await loadConfig<PagesConfig>({ sources: [{ files: 'pages.config' }] })
    if (!config) {
      this.logger?.warn('Can\'t found pages.config, please create pages.config.(ts|mts|cts|js|cjs|mjs|json)')
      process.exit(-1)
    }
    const { onBeforeLoadConfig, onAfterLoadConfig } = this.options
    onBeforeLoadConfig?.(this)
    this.pagesGlobConfig = config
    onAfterLoadConfig?.(this)
  }

  async updatePagesJSON() {
    await this.loadPagesConfig()
    if (this.options.mergePages) {
      const { onBeforeScanPages, onAfterScanPages } = this.options
      onBeforeScanPages?.(this)
      await this.scanPages()
      await this.scanSubPages()
      onAfterScanPages?.(this)

      const { onBeforeMergePagesData, onAfterMergePagesData } = this.options
      onBeforeMergePagesData?.(this)
      await this.mergePagesData()
      await this.mergeSubPagesData()
      onAfterMergePagesData?.(this)
    }
    else {
      this.resolvedPagesData = this.pagesGlobConfig?.pages || []
      this.resolvedSubPagesData = this.pagesGlobConfig?.subPackages || []
    }
    const { onBeforeWriteFile, onAfterWriteFile } = this.options

    onBeforeWriteFile?.(this)
    const data = {
      ...this.pagesGlobConfig,
      pages: this.resolvedPagesData,
      subPackages: this.resolvedSubPagesData,
    }

    const pagesJSON = JSON.stringify(data, null, this.options.minify ? undefined : 2)
    writeFile(this.resolvedPagesJSONPath, pagesJSON)
    onAfterWriteFile?.(this)
  }

  async mergePagesData() {
    this.resolvedPagesData = await this.parsePages(this.pagesPath, this.pagesGlobConfig?.pages)
  }

  async mergeSubPagesData() {
    const subPageMaps: Record<string, PageMeta[]> = {}
    const subPackages = this.pagesGlobConfig?.subPackages || []

    for (const [dir, pages] of Object.entries(this.subPagesPath)) {
      const root = basename(dir)

      const globPackage = subPackages?.find(v => v.root === root)
      subPageMaps[root] = await this.parsePages(pages, globPackage?.pages)
      subPageMaps[root] = subPageMaps[root].map(page => ({ ...page, path: relative(root, page.path) }))
    }

    // Inherit subPackages that do not exist in the config
    for (const { root, pages } of subPackages) {
      if (root && !subPageMaps[root])
        subPageMaps[root] = pages || []
    }

    this.resolvedSubPagesData = Object.keys(subPageMaps).map(root => ({ root, pages: subPageMaps[root] }))
  }

  async parsePages(pages: PagePath[], overrides?: PageMeta[]) {
    const generatedPageMetaData = await Promise.all(pages.map(async page => await this.parsePage(page)))
    const customPageMetaData = overrides || []

    const result = customPageMetaData.length
      ? mergePageMetaDataArray(generatedPageMetaData.concat(customPageMetaData))
      : generatedPageMetaData

    this.setHomePage(result)

    result.sort(page => (page.type === 'home' ? -1 : 0))

    return result
  }

  async parsePage(page: PagePath): Promise<PageMeta> {
    const { relativePath, absolutePath } = page
    const routeBlock = await getRouteBlock(absolutePath, this.options)
    const relativePathWithFileName = relativePath.replace(extname(relativePath), '')
    const pageMetaDatum: PageMeta = {
      path: normalizePath(relativePathWithFileName),
      type: routeBlock?.attr.type ?? 'page',
    }

    if (routeBlock)
      Object.assign(pageMetaDatum, routeBlock.content)

    return pageMetaDatum
  }

  setHomePage(result: PageMeta[]) {
    const hasHome = result.some((page) => {
      if (page.type === 'home')
        return true

      // Exclusion of subcontracting
      const base = page.path.split('/')[0]
      if (this.options.subPackages.includes(`src/${base}`))
        return true

      return false
    })

    if (hasHome)
      return true

    const isFoundHome = result.some((item) => {
      if (this.options.homePage.includes(item.path)) {
        item.type = 'home'
        return true
      }
      else { return false }
    })

    if (isFoundHome)
      return true
    this.logger?.warn('No home page found, check the configuration of pages.config.ts, or add the `homePage` option to UniPages in vite.config.js, or add `type="home"` to the routeBlock of your vue page.', {
      timestamp: true,
    })
  }

  async scanPages() {
    const pageDirFiles = this.options.dirs
      .map(dir => ({ dir, files: getPagesPath(dir, this.options) }))
    this.pagesPath = pageDirFiles.map(page => page.files).flat()
  }

  async scanSubPages() {
    const subPagesPath: Record<string, PagePath[]> = {}
    this.options.subPackages.forEach((dir) => {
      subPagesPath[dir] = getPagesPath(dir, this.options)
    })

    this.subPagesPath = subPagesPath
  }

  async virtualModule() {
    return `export const pages = ${this.resolveRoutes()};`
  }

  resolveRoutes() {
    return JSON.stringify({
      pages: this.resolvedPagesData,
      subPackages: this.resolvedSubPagesData,
    }, null, 2)
  }

  setLogger(logger: Logger) {
    this.logger = logger
  }
}
