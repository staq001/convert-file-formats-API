import cluster from "node:cluster";
import os from "node:os";

const coresCount = os.availableParallelism();

if (cluster.isPrimary) {
  for (let i = 0; i < coresCount; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died (${signal} | ${code}). Restarting...`
    );
  });
} else {
  require("./index.ts");
}
