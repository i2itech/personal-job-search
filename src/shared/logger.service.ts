export class LoggerService {
  static log(message: string, ...args: any[]) {
    console.log(message, ...args);
  }

  static error(message: string | Error, ...args: any[]) {
    if (message instanceof Error) {
      console.error(message.message, ...args);
      console.error(message.stack);
    } else {
      console.error(message, ...args);
    }
  }

  static warn(message: string, ...args: any[]) {
    console.warn(message, ...args);
  }

  static info(message: string, ...args: any[]) {
    console.info(message, ...args);
  }

  static debug(message: string, ...args: any[]) {
    console.debug(message, ...args);
  }

  private name: string;

  constructor({ name }: { name: string }) {
    this.name = name;
  }

  log(message: string, ...args: any[]) {
    LoggerService.log(`[${this.name}] ${message}`, ...args);
  }

  error(message: string | Error, ...args: any[]) {
    if (message instanceof Error) {
      message.message = `[${this.name}] ${message.message}`;
    } else {
      message = `[${this.name}] ${message}`;
    }
    LoggerService.error(message, ...args);
  }

  warn(message: string, ...args: any[]) {
    LoggerService.warn(`[${this.name}] ${message}`, ...args);
  }

  info(message: string, ...args: any[]) {
    LoggerService.info(`[${this.name}] ${message}`, ...args);
  }

  debug(message: string, ...args: any[]) {
    LoggerService.debug(`[${this.name}] ${message}`, ...args);
  }
}

export const getLogger = (name: string) => new LoggerService({ name });
