import type { ResolvedOptions, UniManifestOptions } from './types'

export function resolveOptions(userOptions: UniManifestOptions): ResolvedOptions {
  const {
    minify = false,
    onBeforeWriteFile = () => {},
    onAfterWriteFile = () => {},
  } = userOptions

  const resolvedOptions: ResolvedOptions = {
    minify,
    onBeforeWriteFile,
    onAfterWriteFile,
  }

  return resolvedOptions
}
