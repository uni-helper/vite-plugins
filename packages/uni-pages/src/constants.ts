export const MODULE_ID_VIRTUAL = 'virtual:uni-pages'
export const RESOLVED_MODULE_ID_VIRTUAL = `\0${MODULE_ID_VIRTUAL}`

export const OUTPUT_NAME = 'pages.json'

export const FILE_EXTENSIONS = ['vue', 'nvue', 'uvue']

export const CONFIG_FILE_NAME = 'pages.config'

export const CONFIG_FILE_EXTENSIONS = ['js', 'ts', 'json', 'mjs', 'cjs', 'mts', 'cts']

export const CONFIG_FILE_GLOB = `${CONFIG_FILE_NAME}.{${CONFIG_FILE_EXTENSIONS.join(',')}}`
