import { resolve } from 'node:path'
import type { Options as FastGlobOptions } from 'fast-glob'
import fg from 'fast-glob'

export async function scanFiles(glob: string | string[], options: FastGlobOptions = {}) {
  return await fg(glob, options)
}

export async function scanVueFiles(dir: string, options: FastGlobOptions = {}) {
  dir = resolve(process.cwd(), dir)
  return await scanFiles(['**/*.vue'], { cwd: dir, ...options })
}
