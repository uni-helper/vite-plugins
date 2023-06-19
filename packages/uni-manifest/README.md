# @uni-helper/vite-plugin-uni-manifest

使用 TypeScript 编写 uni-app 的 `manifest.json`

<a href="https://www.npmjs.com/package/@uni-helper/vite-plugin-uni-manifest"><img src="https://img.shields.io/npm/v/@uni-helper/vite-plugin-uni-manifest" alt="NPM version"></a></p>

## 安装

```bash
pnpm i -D @uni-helper/vite-plugin-uni-manifest
```

## 使用

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import Uni from '@dcloudio/vite-plugin-uni'
import UniManifest from '@uni-helper/vite-plugin-uni-manifest'

export default defineConfig({
  plugins: [Uni(), UniManifest()],
})
```

创建 `manifest.config.(ts|mts|cts|js|cjs|mjs|json)`, 然后用 TypeScript 编写你的 `manifest.json`

```ts
// manifest.config.ts
import { defineManifestConfig } from '@uni-helper/vite-plugin-uni-manifest'

export default defineManifestConfig({})
```

在[这里](./playground/manifest.config.ts)，你可以找到 uni-app 默认的 Vite-TS 模版的`manifest.json` 是如何用 TypeScript 编写的

## 配置

```ts
export interface Options {
  /**
   * minify the `manifest.json`
   * @default false
   */
  minify: boolean

  onBeforeWriteFile: (ctx: ManifestContext) => void
  onAfterWriteFile: (ctx: ManifestContext) => void
}
```
