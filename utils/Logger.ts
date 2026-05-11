enum LogLevel { INFO, WARN, ERROR }

export class Logger {
    private formatMessage(level: LogLevel, message: string): string {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${LogLevel[level]}] ${message}`;
    }

    public info(message: string): void {
        console.log(this.formatMessage(LogLevel.INFO, message));
    }

    public warn(message: string): void {
        console.warn(this.formatMessage(LogLevel.WARN, message));
    }

    public error(message: string, error?: any): void {
        console.error(this.formatMessage(LogLevel.ERROR, message));
        if (error && error.stack) {
            console.error(error.stack);
        }
    }
}