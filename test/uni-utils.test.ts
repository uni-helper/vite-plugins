import { describe, expect, it } from 'vitest'
import { scanVueFiles } from '@uni-helper/vite-plugin-uni-utils'

describe('display files under packages', () => {
  it('vue files', async () => {
    const files = await scanVueFiles('./test/pages')
    expect(files).toMatchInlineSnapshot(`
      [
        "index.vue",
        "home/index.vue",
        "home/detail/index.vue",
      ]
    `)
  })
})
