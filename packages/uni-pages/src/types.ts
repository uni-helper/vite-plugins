import type { GlobalStyle } from './config'
import type { PageContext } from './context'

export interface CustomBlock {
  attr: Record<string, any>
  content: Record<string, any>
}

export interface Options {
  /**
   * The default application entry page is the home page
   * @default 'pages/index' or 'pages/index/index'
   */
  homePage: string

  /**
   * Whether to merge pages in pages.json
   * @default true
   */
  mergePages: boolean

  /**
   * Paths to the directory to search for page components.
   * @default ['src/pages']
   */
  dirs: string[]

  /**
   * all root directories loaded by subPackages
   * @default []
   */
  subPackages: string[]

  /**
   * pages.json dir
   * @default "src"
   */
  outDir: string

  /**
   * exclude page
   * @default []
   */
  exclude: string[]

  /**
   * Set the default route block parser, or use `<route lang="xxx">` in SFC route block
   * @default 'json5'
   */
  routeBlockLang: 'json5' | 'json' | 'yaml' | 'yml'

  /**
   * minify the `pages.json`
   * @default false
   */
  minify: boolean

  onBeforeLoadConfig: (ctx: PageContext) => void
  onAfterLoadConfig: (ctx: PageContext) => void
  onBeforeScanPages: (ctx: PageContext) => void
  onAfterScanPages: (ctx: PageContext) => void
  onBeforeMergePagesData: (ctx: PageContext) => void
  onAfterMergePagesData: (ctx: PageContext) => void
  onBeforeWriteFile: (ctx: PageContext) => void
  onAfterWriteFile: (ctx: PageContext) => void
}

export type UniPagesOptions = Partial<Options>

export interface ResolvedOptions extends Omit<Options, 'dir' | 'homePage'> {
  /**
   * Resolves to the `root` value from Vite config.
   * @default config.root
   */
  root: string

  /**
   * Resolved page dirs
   */
  dirs: string[]
  /**
   * Resolved entry page
   */
  homePage: string[]
}

export interface PagePath {
  relativePath: string
  absolutePath: string
}

export interface PageMeta {
  /**
   * 配置页面路径
   */
  path: string
  type?: string
  /**
   * 配置页面窗口表现，配置项参考下方 pageStyle
   */
  style?: GlobalStyle
  /**
   * 当前页面是否需要登录才可以访问，此配置优先级高于 uniIdRouter 下的 needLogin
   */
  needLogin?: boolean
  [x: string]: any
}

export interface SubPageMeta {
  root: string
  pages: PageMeta[]
}
