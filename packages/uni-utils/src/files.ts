import fs from 'node:fs'
import type { Options as FastGlobOptions } from 'fast-glob'
import fg from 'fast-glob'

export function scanFiles(extensions: string[], options: FastGlobOptions = {}) {
  return fg.sync([`**/*${extsToGlob(extensions)}`], { ...options })
}

export function scanDirs(dir: string | string[], options: FastGlobOptions = {}) {
  return fg.sync(dir, {
    onlyDirectories: true,
    dot: true,
    unique: true,
    ...options,
  })
}

export function resolveConfigFile(configFile: string | string[], options: FastGlobOptions = {}) {
  return fg.sync(configFile, { onlyFiles: true, absolute: true, ...options })
}

export function checkJSONFileExist(path: string, content?: string | NodeJS.ArrayBufferView) {
  if (!fs.existsSync(path)) {
    if (content) {
      writeFile(path, content)
      return true
    }
    return false
  }
  return true
}

export function writeFile(path: string, content: string | NodeJS.ArrayBufferView) {
  fs.writeFileSync(path, content, { encoding: 'utf-8' })
}

export function extsToGlob(extensions: string[]) {
  return extensions.length > 1 ? `{${extensions.join(',')}}` : (extensions[0] || '')
}
