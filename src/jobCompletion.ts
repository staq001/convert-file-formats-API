import process from "node:process";
import crypto from "node:crypto";

type CompletionCallback = (success: boolean) => void;

const pendingJobs = new Map<string, CompletionCallback>();

// Listen for completion messages from primary process
if (process.send) {
  process.on("message", (message: any) => {
    if (message.type === "jobComplete" && message.requestId) {
      const callback = pendingJobs.get(message.requestId);
      if (callback) {
        callback(message.success);
        pendingJobs.delete(message.requestId);
      }
    }
  });
}

export function sendJobAndWait(jobData: any): Promise<boolean> {
  return new Promise((resolve) => {
    const requestId = crypto.randomBytes(8).toString("hex");

    pendingJobs.set(requestId, resolve);

    if (process.send) {
      process.send({
        ...jobData,
        requestId,
      });
    } else {
      resolve(true);
    }
  });
}
