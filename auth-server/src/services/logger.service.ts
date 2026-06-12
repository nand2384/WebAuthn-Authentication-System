class LoggerService {
    private formatMessage(level: string, message: string): string {
        const timestamp = new Date().toISOString();

        return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    }

    info(message: string): void {
        console.log(this.formatMessage("info", message));
    }

    warn(message: string): void {
        console.warn(this.formatMessage("warn", message));
    }

    error(message: string): void {
        console.error(this.formatMessage("error", message));
    }
};

export default LoggerService;