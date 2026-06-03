// frontend/src/utils/logger.ts

class Logger {
    private isProduction: boolean;

    constructor() {
        this.isProduction = import.meta.env.MODE === 'production';
    }

    info(message: string, ...args: any[]) {
        if (!this.isProduction) {
            console.info(`[INFO] ${message}`, ...args);
        }
    }

    warn(message: string, ...args: any[]) {
        if (!this.isProduction) {
            console.warn(`[WARN] ${message}`, ...args);
        }
    }

    error(message: string, ...args: any[]) {
        if (!this.isProduction) {
            console.error(`[ERROR] ${message}`, ...args);
        }
    }

    debug(message: string, ...args: any[]) {
        if (!this.isProduction) {
            console.debug(`[DEBUG] ${message}`, ...args);
        }
    }
}

export const logger = new Logger();
