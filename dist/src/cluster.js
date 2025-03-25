"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cluster_1 = __importDefault(require("node:cluster"));
const node_os_1 = __importDefault(require("node:os"));
const jobQueue_1 = require("../lib/jobQueue");
const job = new jobQueue_1.JobQueue();
const coresCount = node_os_1.default.availableParallelism();
if (node_cluster_1.default.isPrimary) {
    for (let i = 0; i < coresCount; i++) {
        node_cluster_1.default.fork();
    }
    node_cluster_1.default.on("message", (worker, message, handle) => {
        const { type, id, file_extension, dest_extension, name } = message;
        console.log(message);
        job.enqueue({
            type,
            id,
            file_extension,
            dest_extension,
            name,
        });
    });
    node_cluster_1.default.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died (${signal} | ${code}). Restarting...`);
        node_cluster_1.default.fork();
    });
}
else {
    require("./index.js");
}
