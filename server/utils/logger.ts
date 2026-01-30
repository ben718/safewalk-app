/**
 * Système de logging pour le serveur backend
 * Désactive automatiquement les logs debug/info en production
 */

const isDevelopment = process.env.NODE_ENV !== 'production';

class ServerLogger {
  private prefix: string;

  constructor(prefix: string = '[SafeWalk Server]') {
    this.prefix = prefix;
  }

  debug(message: string, ...args: any[]) {
    if (isDevelopment) {
      console.log(`${this.prefix} [DEBUG]`, message, ...args);
    }
  }

  info(message: string, ...args: any[]) {
    if (isDevelopment) {
      console.log(`${this.prefix} [INFO]`, message, ...args);
    }
  }

  warn(message: string, ...args: any[]) {
    console.warn(`${this.prefix} [WARN]`, message, ...args);
  }

  error(message: string, ...args: any[]) {
    console.error(`${this.prefix} [ERROR]`, message, ...args);
  }
}

export const logger = new ServerLogger();
