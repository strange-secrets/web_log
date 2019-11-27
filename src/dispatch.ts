import { LogConfig } from './config';

/**
 * @type {object} LogInfo - Represents a single line of logged information.
 * @property {string?} category - Title specific category associated with message being logged.
 * @property {string} message - The message being logged.
 * @property {string?} stack - Call-stack associated with captured errors.
 * @property {number} time - Timestamp of captured information
 * @property {string} type - The type of logged information.
 */
type LogInfo = {
    category?: string,
    message: string,
    stack?: string,
    time: number,
    type: string,
}

/**
 * @type {object} SendQueue - Represents a collection of log messages waiting to be sent to the server.
 * @property {string} version - The version number associated with the application sending the log information.
 * @property {string} sessionId - Unique identifier associated with the applications current session.
 * @property {string} userName - Name of the user to be associated with the logged information.
 * @property {string} userId - Identifier of the user to be associated with the logged information.
 * @property {LogInfo[]} log - List of logged lines to be sent to the server.
 */
type SendQueue = {
    version: string,
    sessionId: string,
    userName: string,
    userId: string,
    log: LogInfo[],
}

let sendErrors = 0;
let timeoutHandle = 0;
let pendingQueue: SendQueue = null;
let serverUri = '';

const MAXIMUM_SEND_ERRORS = 3;

const HTTP_METHOD = 'POST';
const HTTP_HEADERS = {
    'Content-Type': 'application/json',
};

/**
 * Sends our log data to the server then clears the local storage
 */
function forceDispatch(): void {
    if (timeoutHandle) {
        clearTimeout(timeoutHandle);
        timeoutHandle = 0;
    }

    if (pendingQueue && pendingQueue.log.length) {
        fetch(serverUri, {
            method: HTTP_METHOD,
            headers: HTTP_HEADERS,
            cache: 'no-cache',
            redirect: 'follow',
            referrer: 'no-referrer',
            credentials: 'same-origin',
            body: JSON.stringify(pendingQueue),
        }).catch(err => {
            sendErrors++;
        });

        pendingQueue.log = [];
    }
}

/**
 * Event handler invoked when our send timeout has elapsed
 */
function processTimeout(): void {
    timeoutHandle = 0;
    forceDispatch();
}

/**
 * Main entry point allowing the framework to send logging information to a remote server.
 * @param {LogConfig} config
 * @param {LogInfo} info
 */
export default function dispatch(config: LogConfig, info: LogInfo): void {
    if (config.uri && sendErrors < MAXIMUM_SEND_ERRORS) {
        // If shared information has changed, dispatch the previous information before we queue the new logs
        if (pendingQueue) {
            if (   config.uri !== serverUri
                || pendingQueue.version !== config.version
                || pendingQueue.sessionId !== config.sessionId
                || pendingQueue.userName !== config.userName
                || pendingQueue.userId !== config.userId
            ) {
                forceDispatch();
            }
        }

        if (!pendingQueue) {
            serverUri = config.uri;

            pendingQueue = {
                version: config.version,
                sessionId: config.sessionId,
                userName: config.userName,
                userId: config.userId,
                log: [],
            };
        }

        pendingQueue.log.unshift(info);

        if (!config.sendDelay) {
            forceDispatch();
        } else if (timeoutHandle) {
            if (pendingQueue.log.length >= config.sendCapacity) {
                forceDispatch();
            }
        } else {
            setTimeout(processTimeout, config.sendDelay);
        }
    }
}
