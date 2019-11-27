import { LogConfig } from './config';
import dispatch from './dispatch';

const SystemLog = console.log;
const SystemWarn = console.warn;
const SystemError = console.error;

const DEFAULT_SEND_DELAY = 1 * 1000;
const DEFAULT_SEND_CAPACITY = 128;

const DEFAULT_CONFIG: LogConfig = {
    uri: '',
    sendDelay: DEFAULT_SEND_DELAY,
    sendCapacity: DEFAULT_SEND_CAPACITY,
    userName: '',
    userId: '',
    sessionId: '',
    version: '',
    systemLog: true,
    captureErrors: true,
};

let activeConfig = DEFAULT_CONFIG;

/**
 * Prepares the logging module for use by the application.
 */
export function configure(config: LogConfig): void {
    // Additional properties can go here
    if (typeof window === 'undefined') {
        // We are in node
    } else {
        // We are in the browser
        console.log = log;
        console.warn = warn;
        console.error = error;

        window.onerror = globalErrorHandler;
    }

    activeConfig = Object.assign({}, DEFAULT_CONFIG, activeConfig, config);
}

/**
 * Takes an in-coming log and adds it to the dispatched log information.
 * @param {string} message - The message to be logged.
 * @param {string} type - The type of log message being added.
 * @param {string} category - Category associated with the message.
 */
function addLog(message: string, type: string, category?: string): void {
    return dispatch(activeConfig, {
        time: Date.now(),
        category,
        message,
        type,
    });
}

/**
 * Takes captured error information and adds it to the logging service.
 * @param {string} message - Message that explains the error that occurred.
 * @param {string} source - Filename of the source file where the error originated.
 * @param {string} line - Line number within the source file where the error originated.
 * @param {string} column - Column number within the source file where the error originated.
 * @param {Error} error - The error object that was thrown.
 */
function captureError(message: string, source: string, line: number, column: number, error: Error) {
    return dispatch(activeConfig, {
        time: Date.now(),
        type: 'capture',
        stack: error.stack,
        message,
    });
}

function globalErrorHandler(message: string | Event, source: string, line: number, column: number, error: Error): void {
    if (activeConfig.captureErrors && message) {
        if (typeof message === 'string') {
            captureError(message, source, line, column, error);
        } else {
            // Error is an event object
            const err = message as ErrorEvent;
            captureError(err.message, err.filename, err.lineno, err.colno, err.error);
        }
    }
}

/**
 * Logs an informative message with the application.
 * @param {string} message - The message to be logged.
 * @param {string} category - Category associated with the message.
 */
export function log(message: string, category?: string): void {
    addLog(message, 'log', category);

    if (activeConfig.systemLog) {
        SystemLog.call(console, message);
    }
}

/**
 * Logs a warning message with the framework.
 * @param {string} message - The warning message to be logged.
 * @param {string} category - Category associated with the message.
 */
export function warn(message: string, category?: string): void {
    if (message) {
        addLog(message, 'warn', category);

        if (activeConfig.systemLog) {
            SystemWarn.call(console, message);
        }
    }
}

/**
 * Logs an error message with the framework.
 * @param {string} message - The error message to be logged.
 * @param {string} category - Category associated with the message.
 */
export function error(message: string, category?: string): void {
    if (message) {
        addLog(message, 'error', category);

        if (activeConfig.systemLog) {
            SystemError.call(console, message);
        }
    }
}
