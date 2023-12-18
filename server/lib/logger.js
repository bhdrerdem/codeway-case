import pino from "pino";

let logger = null;
if (process.env.NODE_ENV !== "production") {
    logger = pino({
        transport: {
            target: "pino-pretty",
            options: {
                colorize: true,
            },
        },
        base: undefined,
        sync: false,
        level: "debug",
    });
} else {
    logger = pino({
        base: undefined,
    });
}

export default logger;
