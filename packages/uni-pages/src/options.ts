import type { ResolvedOptions, UniPagesOptions } from './types'

export function resolveOptions(userOptions: UniPagesOptions, viteRoot?: string): ResolvedOptions {
  const {
    homePage = ['pages/index', 'pages/index/index'],
    mergePages = true,
    dirs = ['src/pages'],
    subPackages = [],

    outDir = 'src',
    exclude = ['node_modules', '.git', '**/__*__/**'],
    routeBlockLang = 'json5',
    minify = false,

    onBeforeLoadConfig = () => {},
    onAfterLoadConfig = () => {},
    onBeforeScanPages = () => {},
    onAfterScanPages = () => {},
    onBeforeMergePagesData = () => {},
    onAfterMergePagesData = () => {},
    onBeforeWriteFile = () => {},
    onAfterWriteFile = () => {},
  } = userOptions

  const root = viteRoot || process.cwd()
  const ResolvedHomePage = typeof homePage === 'string' ? [homePage] : homePage

  const resolvedOptions: ResolvedOptions = {
    homePage: ResolvedHomePage,
    mergePages,
    dirs,
    subPackages,
    outDir,
    exclude,
    routeBlockLang,
    root,
    minify,
    onBeforeLoadConfig,
    onAfterLoadConfig,
    onBeforeScanPages,
    onAfterScanPages,
    onBeforeMergePagesData,
    onAfterMergePagesData,
    onBeforeWriteFile,
    onAfterWriteFile,
  }

  return resolvedOptions
}
