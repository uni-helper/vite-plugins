import Debug from 'debug'

export class _Debug {
  private _prefix: string
  constructor(prefix: string) {
    this._prefix = prefix
  }

  public hmr(...args: any[]) {
    Debug(`${this._prefix}:hmr`)(args)
  }

  public options(...args: any[]) {
    Debug(`${this._prefix}:options`)(args)
  }

  public error(...args: any[]) {
    Debug(`${this._prefix}:error`)(args)
  }

  public info(info: string, ...args: any[]) {
    Debug(`${this._prefix}:${info}`)(args)
  }
}
