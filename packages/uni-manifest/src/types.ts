import type { ManifestContext } from './context'

export interface Options {
  /**
   * minify the `manifest.json`
   * @default false
   */
  minify: boolean

  onBeforeWriteFile: (ctx: ManifestContext) => void
  onAfterWriteFile: (ctx: ManifestContext) => void
}

export type UniManifestOptions = Partial<Options>

export interface ResolvedOptions extends Options {}
