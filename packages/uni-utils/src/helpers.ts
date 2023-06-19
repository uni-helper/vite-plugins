import { spawn } from 'node:child_process'

export async function restart() {
  return new Promise((resolve) => {
    const build = spawn(process.argv.shift()!, process.argv, {
      cwd: process.cwd(),
      detached: true,
      env: process.env,
    })
    build.stdout?.pipe(process.stdout)
    build.stderr?.pipe(process.stderr)
    build.on('close', (code) => {
      resolve(process.exit(code!))
    })
  })
}
