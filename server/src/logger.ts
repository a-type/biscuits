export class Logger {
  constructor(private tag: string) {}

  info(...args: any[]) {
    console.log(`[${this.tag}]`, ...args);
  }

  warn(...args: any[]) {
    console.warn(`[${this.tag}]`, ...args);
  }

  urgent(...args: any[]) {
    console.error(`[${this.tag}]`, ...args);
  }

  fatal(...args: any[]) {
    console.error(`[${this.tag}]`, '<<FATAL>>', ...args);
  }

  debug(...args: any[]) {
    console.debug(`[${this.tag}]`, ...args);
  }
}

export const logger = new Logger('server');
