export class Logger {
	constructor(private tag: string) {}

	// CF observability doesn't print objects, so we need to convert them to strings
	private processArgs(args: any[]): any[] {
		return args.map((arg) => {
			if (arg instanceof Error) {
				return arg.stack ?? arg.message;
			}
			if (typeof arg === 'object') {
				try {
					return JSON.stringify(arg);
				} catch {
					return String(arg);
				}
			}
			return arg;
		});
	}

	info = (...args: any[]) => {
		console.log(`[${this.tag}]`, ...this.processArgs(args));
	};

	warn = (...args: any[]) => {
		console.warn(`[${this.tag}]`, ...this.processArgs(args));
	};

	urgent = (...args: any[]) => {
		console.error(`[${this.tag}]`, ...this.processArgs(args));
	};

	fatal = (...args: any[]) => {
		console.error(`[${this.tag}]`, '<<FATAL>>', ...this.processArgs(args));
	};

	debug = (...args: any[]) => {
		console.debug(`[${this.tag}]`, ...this.processArgs(args));
	};
}

export const logger = new Logger('server');
