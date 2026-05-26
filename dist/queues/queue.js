"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reminderQueue = void 0;
const bullmq_1 = require("bullmq");
exports.reminderQueue = new bullmq_1.Queue('reminders', {
    connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
    },
    defaultJobOptions: {
        attempts: 5,
        backoff: {
            type: 'exponential',
            delay: 5000,
        },
        removeOnComplete: 100,
        removeOnFail: 200,
    },
});
//# sourceMappingURL=queue.js.map