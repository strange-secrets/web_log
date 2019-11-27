/**
 * The configuration object allows the title to provide additionally information on how it would like the
 * logging service to behave.
 *
 * uri - Address of logging server all logs will be sent to.
 * sendDelay - Delay (in milliseconds) logs will be cached for before being dispatched to the server.
 * sendCapacity - Maximum number of queued messages before they are forcibly sent to the server.
 * userName - Optional name of the user to be associated with the logged messages.
 * userId - Optional user identifier to be associated with the logged messages.
 * sessionId - Identifier of the session to be associated with the logged messages.
 * version - Version identifier of the client code being executed.
 * systemLog - If true then logged output is also echoed to the console, if false output is hidden.
 */
export type LogConfig = {
    uri: string,
    sendDelay: number,
    sendCapacity: number,
    userName: string,
    userId: string,
    sessionId: string,
    version: string,
    systemLog: boolean,     // True if logs should be forwarded to the default system log or False to be suppressed.
    captureErrors: boolean, // True if unhandled errors should be captured by the service
};
