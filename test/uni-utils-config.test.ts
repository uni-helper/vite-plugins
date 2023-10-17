import { join } from 'node:path'
import process from 'node:process'
import { describe, expect, it } from 'vitest'
import { resolveConfigFile, scanDirs, scanFiles } from '@uni-helper/vite-plugin-uni-utils'

describe('display files under pages', () => {
  it('vue files', async () => {
    const files = scanFiles(['vue'], { cwd: join(process.cwd(), 'playground/src') })
    expect(files).toMatchInlineSnapshot(`
      [
        "App.vue",
        "pages/A-top.vue",
        "pages/index.vue",
        "pages/test-json.vue",
        "pages/test-yaml.vue",
        "pages/test.vue",
        "pages-sub/index.vue",
        "pages/blog/index.vue",
        "pages/blog/post.vue",
        "pages-sub/about/index.vue",
        "pages-sub/about/your.vue",
      ]
    `)
  })
})

describe('display dirs under pages', () => {
  it('dirs', async () => {
    const dirs = scanDirs('src/pages/**', { cwd: join(process.cwd(), 'playground') })
    expect(dirs).toMatchInlineSnapshot(`
      [
        "src/pages/blog",
      ]
    `)
  })
})

describe('display config file', () => {
  it('pages config file', async () => {
    const files = resolveConfigFile('pages.config.(ts|mts|cts|js|cjs|mjs|json)', { cwd: join(process.cwd(), 'playground') })
    expect(files).toMatchInlineSnapshot(`
      [
        "C:/Users/neil/i/uni-helper/vite-plugins/playground/pages.config.ts",
      ]
    `)
  })
})
