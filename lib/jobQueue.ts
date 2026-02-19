import type { Job } from "../src/types";
import fs from "fs/promises";
import * as poppler from "./poppler";
import * as gs from "./ghostscript";
import { util } from "../lib/util";

export class JobQueue {
  jobs: Array<{ job: Job; onComplete?: (success: boolean) => void }>;
  currentJob: Job | null;
  currentCallback?: (success: boolean) => void;

  constructor() {
    this.jobs = [];
    this.currentJob = null;
  }

  enqueue(job: Job, onComplete?: (success: boolean) => void) {
    this.jobs.push({ job, onComplete });
    this.executeNext();
  }

  dequeue() {
    return this.jobs.shift();
  }

  executeNext() {
    if (this.currentJob) return;

    const item = this.dequeue();
    if (!item) return;
    this.currentJob = item.job;
    this.currentCallback = item.onComplete;
    this.execute(this.currentJob);
  }

  async execute(job: Job) {
    let success = true;
    try {
      switch (job.type) {
        // merge pdf-
        case "merge":
          const [first, second] = job.id.split("-");

          const firstFilePath = `./storage/${first}/original.${job.file_extension}`;
          const secondFilePath = `./storage/${second}/original.${job.file_extension}`;

          const mergedFileDestination = `./storage/${first}/merged-file.pdf`;

          try {
            await poppler.mergePDF(
              firstFilePath,
              secondFilePath,
              mergedFileDestination,
            );
            console.log(`Done! Number of Jobs remaining: ${this.jobs.length}`);
          } catch (e) {
            await util.deleteFolder(`./storage/${first}-${second}/`);
            success = false;
          }
          break;

        // compress pdf
        case "compress":
          const originalPath = `./storage/${job.id}/original.${job.file_extension}`;
          const destination = `./storage/${job.id}/original-compressed.pdf`;

          try {
            await gs.compressPDF(originalPath, destination);
            console.log(`Done! Number of Jobs remaining: ${this.jobs.length}`);
          } catch (e) {
            await util.deleteFile(destination);
            success = false;
          }
          break;

        // all conversions.
        case "convertPdf":
          switch (job.dest_extension) {
            case "txt":
              const originalPath = `./storage/${job.id}/original.${job.file_extension}`;
              const textPath = `./storage/${job.id}/original.${job.dest_extension}`;

              try {
                await poppler.makeText(originalPath, textPath);
                console.log(
                  `Done! Number of Jobs remaining: ${this.jobs.length}`,
                );
              } catch (e) {
                util.deleteFile(textPath);
                success = false;
              }
              break;
            case "html":
              await fs.mkdir(`./storage/${job.id}/html/`, { recursive: true });

              const inputFilePath = `./storage/${job.id}/original.${job.file_extension}`;
              const htmlPath = `./storage/${job.id}/html/original.${job.dest_extension}`;

              try {
                await poppler.makeHTML(inputFilePath, htmlPath);
                console.log(
                  `Done! Number of Jobs remaining: ${this.jobs.length}`,
                );
              } catch (e) {
                await util.deleteFolder(`./storage/${job.id}/html/`);
                success = false;
              }
              break;
            case "png":
              await fs.mkdir(`./storage/${job.id}/pdf-image-folder/`, {
                recursive: true,
              });

              const filePath = `./storage/${job.id}/original.${job.file_extension}`;
              const imagePath = `./storage/${job.id}/pdf-image-folder/original.${job.dest_extension}`;

              try {
                await poppler.makeImage(filePath, imagePath);
                console.log(
                  `Done! Number of Jobs remaining: ${this.jobs.length}`,
                );
              } catch (e) {
                await util.deleteFolder(
                  `./storage/${job.id}/pdf-image-folder/`,
                );
                success = false;
              }
              break;
            case "docx":
              // write logic later
              break;
          }
          break;
        case "convertDocx":
          // write logic.
          break;
      }
    } catch (e) {
      console.error("Job execution error:", e);
      success = false;
    }

    // Call completion callback if exists
    if (this.currentCallback) {
      this.currentCallback(success);
    }

    this.currentJob = null;
    this.currentCallback = undefined;
    this.executeNext();
  }
}
