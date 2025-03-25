import cluster from "node:cluster";
import os from "node:os";
import { JobQueue } from "../lib/jobQueue";

const job = new JobQueue();
const coresCount = os.availableParallelism();

if (cluster.isPrimary) {
  for (let i = 0; i < coresCount; i++) {
    cluster.fork();
  }

  cluster.on("message", (worker, message, handle) => {
    const { type, id, file_extension, dest_extension, name } = message;

    job.enqueue({
      type,
      id,
      file_extension,
      dest_extension,
      name,
    });
  });

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died (${signal} | ${code}). Restarting...`
    );
    cluster.fork();
  });
} else {
  require("./index.js");
}
