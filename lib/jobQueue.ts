import type { Job } from "../src/types";

export class JobQueue {
  jobs: Job[];
  currentJob: Job | null;

  constructor() {
    this.jobs = [];
    // this.currentJob = null;
  }

  enqueue(job: Job) {
    this.jobs.push(job);
    this.executeNext();
  }

  dequeue() {
    return this.jobs.shift();
  }

  executeNext() {
    if (this.currentJob) return;
    this.currentJob = this.dequeue() as Job;
    if (!this.currentJob) return;
    this.execute(this.currentJob);
  }

  async execute(job: Job) {}
}
