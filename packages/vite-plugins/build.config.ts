import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/uni-pages',
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
})
