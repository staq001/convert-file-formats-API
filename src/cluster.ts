import cluster from "node:cluster";
import os from "node:os";
import { JobQueue } from "../lib/jobQueue";

let job: JobQueue | null;
const coresCount = os.availableParallelism();

if (cluster.isPrimary) {
  job = new JobQueue();

  for (let i = 0; i < coresCount; i++) {
    cluster.fork();
  }

  cluster.on("message", async (worker, message, handle) => {
    const { type, id, file_extension, dest_extension, name, requestId } =
      message;

    job!.enqueue(
      {
        type,
        id,
        file_extension,
        dest_extension,
        name,
      },
      (success) => {
        // Send completion message back to worker
        if (requestId) {
          worker.send({
            type: "jobComplete",
            requestId,
            success,
          });
        }
      },
    );
  });

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died (${signal} | ${code}). Restarting...`,
    );
    cluster.fork();
  });
} else {
  require("./index.js");
}
