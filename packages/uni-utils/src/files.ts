import { resolve } from 'node:path'
import type { Options as FastGlobOptions } from 'fast-glob'
import fg from 'fast-glob'

export async function scanVueFiles(dir: string, options: FastGlobOptions = {}) {
  dir = resolve(process.cwd(), dir)
  return await fg(['**/*.vue'], { cwd: dir, ...options })
}
