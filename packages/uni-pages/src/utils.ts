import { join, relative } from 'node:path'
import type { ModuleNode, ViteDevServer } from 'vite'
import { groupBy } from 'lodash-unified'
import { scanFiles } from '@uni-helper/vite-plugin-uni-utils'
import { CONFIG_FILE_NAME, FILE_EXTENSIONS, RESOLVED_MODULE_ID_VIRTUAL } from './constants'
import type { PageMeta, ResolvedOptions } from './types'

export function invalidatePagesModule(server: ViteDevServer) {
  const { moduleGraph } = server
  const mods = moduleGraph.getModulesByFile(RESOLVED_MODULE_ID_VIRTUAL)
  if (mods) {
    const seen = new Set<ModuleNode>()
    mods.forEach((mod) => {
      moduleGraph.invalidateModule(mod, seen)
    })
  }
}

export function getPagesPath(dir: string, options: ResolvedOptions) {
  const pagesDirPath = join(options.root, dir)
  const basePath = join(options.root, options.outDir)
  const files = getPagesFiles(pagesDirPath, options)
  const pagePaths = files
    .map(file => ({
      relativePath: relative(basePath, join(pagesDirPath, file)),
      absolutePath: join(pagesDirPath, file),
    }))

  return pagePaths
}

export function getPagesFiles(path: string, options: ResolvedOptions) {
  const files = scanFiles(
    FILE_EXTENSIONS,
    { ignore: options.exclude, onlyFiles: true, cwd: path },
  )
  return files
}

export function isTargetFile(path: string) {
  const ext = path.split('.').pop()
  return FILE_EXTENSIONS.includes(ext!)
}

export function isConfigFile(path: string) {
  return path.includes(CONFIG_FILE_NAME)
}

/**
 * merge page meta data array by path and assign style
 * @param pageMetaData  page meta data array
 * TODO: support merge middleware
 */
export function mergePageMetaDataArray(pageMetaData: PageMeta[]) {
  const pageMetaDataObj = groupBy(pageMetaData, 'path')
  const result: PageMeta[] = []
  for (const path in pageMetaDataObj) {
    const _pageMetaData = pageMetaDataObj[path]
    const options = _pageMetaData[0]
    for (const page of _pageMetaData) {
      options.style = Object.assign(options.style ?? {}, page.style ?? {})
      Object.assign(options, page)
    }
    result.push(options)
  }
  return result
}
