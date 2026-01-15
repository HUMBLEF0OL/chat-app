type LogLevel = 'info' | 'error' | 'warn' | 'debug';

interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    data?: any;
}

class Logger {
    private log(level: LogLevel, message: string, data?: any): void {
        const entry: LogEntry = {
            level,
            message,
            timestamp: new Date().toISOString(),
            data,
        };

        const formattedMessage = `[${entry.timestamp}] [${level.toUpperCase()}] ${message}`;

        switch (level) {
            case 'error':
                console.error(formattedMessage, data || '');
                break;
            case 'warn':
                console.warn(formattedMessage, data || '');
                break;
            case 'debug':
                if (process.env.NODE_ENV === 'development') {
                    console.debug(formattedMessage, data || '');
                }
                break;
            default:
                console.log(formattedMessage, data || '');
        }
    }

    info(message: string, data?: any): void {
        this.log('info', message, data);
    }

    error(message: string, data?: any): void {
        this.log('error', message, data);
    }

    warn(message: string, data?: any): void {
        this.log('warn', message, data);
    }

    debug(message: string, data?: any): void {
        this.log('debug', message, data);
    }
}

export const logger = new Logger();
